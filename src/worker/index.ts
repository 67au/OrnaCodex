import type { EntrySearchDoc, StatValue } from '@/types/codex'
import type { Filter, FilterOperator, FiltersState } from '@/types/filters'
import type { SortsState } from '@/types/sort'
import type {
  Actions,
  ActionType,
  IndexJson,
  Message,
  QueryIndexPost,
  SearchGroup,
  TranslationsPost,
} from '@/types/worker'
import { isNull, isUndefined, memoize, type MemoizeCache } from 'es-toolkit'
import {
  Map as ImmutableMap,
  Set,
  List,
  fromJS,
  OrderedMap,
  Collection,
  isIndexed,
} from 'immutable'
import { useDebounceFn } from '@vueuse/core'

class LRUCache<K, V> implements MemoizeCache<K, V> {
  private cache = new Map<K, V>()
  private maxSize = 30

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (!isUndefined(firstKey)) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  get(key: K): V | undefined {
    return this.cache.get(key)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}

function cmp<T extends number | string | boolean | undefined>(x: T, y: T): number {
  if (x === y) {
    return 0
  }
  if (isUndefined(x)) {
    return 1
  }
  if (isUndefined(y)) {
    return -1
  }
  if (typeof x === 'number') {
    return x > (y as number) ? 1 : -1
  }
  if (typeof x === 'string') {
    return x.localeCompare(y as string) ? 1 : -1
  }
  return 0
}

type OpType = 'UNION' | 'INTERSECT'

function combineSets<T>(sets: List<Set<T>>, op: OpType | FilterOperator) {
  if (sets.size > 0) {
    if (op === 'UNION' || op.endsWith('any')) {
      return sets.get(0)!.union(...sets.slice(1))
    }
    if (op === 'INTERSECT' || op.endsWith('all')) {
      return sets.get(0)!.intersect(...sets.slice(1))
    }
  }
  return Set<T>()
}

function indexReviver<K, V>(
  key: string | number,
  value: Collection<K, V>,
  path?: Array<string | number>,
) {
  if (path?.length === 3) {
    return value.toSet()
  }
  if (isIndexed(value) && path?.length !== 2) {
    return ImmutableMap(value)
  }
  return value.toMap()
}

function useFilter() {
  const index = {
    keys: List<string>(),
    keySet: Set<string>(),
    tiers: List<string>(),
    groups: ImmutableMap<string, SearchGroup>(),
  }

  const cache = new LRUCache<string, Set<string>>()

  function update(keys: Array<string>, filters: IndexJson) {
    index.keys = fromJS(keys)
    index.keySet = index.keys.toSet()
    index.groups = fromJS(filters, indexReviver) as ImmutableMap<string, SearchGroup>
    const tiers = index.groups.get('tier')
    if (!isUndefined(tiers)) {
      index.tiers = tiers
        .entrySeq()
        .sortBy((v) => v[0])
        .map(([_, v]) => v.sort())
        .flatten()
        .toList() as List<string>
    }

    cache.clear()
  }

  function combineFilterSet([key, f]: [string, Filter], eventDrops: boolean) {
    const group = index.groups.get(key)
    if (isUndefined(group)) {
      return Set<string>()
    }

    const filterValueList = List<number | string>(f.value)

    return combineSets(
      filterValueList.map((k) => group.get(k)).filter((v) => !isUndefined(v)),
      f.operator,
    ).withMutations((ctx) => {
      if (eventDrops && key === 'events') {
        const dropsGroup = index.groups.get('event_drops')
        if (!isUndefined(dropsGroup)) {
          ctx.union(
            combineSets(
              filterValueList.map((k) => dropsGroup.get(k)).filter((v) => !isUndefined(v)),
              f.operator,
            ),
          )
        }
      }
    })
  }

  const filterCache = memoize(
    ([filters, eventDrops]: [FiltersState['filters'], boolean]) => {
      if (filters.length === 0) {
        return index.keySet
      }

      const intersectFilters = List(filters.filter(([_, f]) => f.operator.startsWith('in')))

      const intersectSet = combineSets(
        intersectFilters.map((f) => {
          return combineFilterSet(f, eventDrops)
        }),
        'INTERSECT',
      )

      if (intersectSet.size === 0 && intersectFilters.size > 0) {
        return Set<string>()
      }

      const subtractFilters = List(filters.filter(([_, f]) => f.operator.startsWith('sub')))

      if (subtractFilters.size === 0) {
        return intersectSet
      }

      const subtractSet = combineSets(
        subtractFilters.map((f) => {
          return combineFilterSet(f, eventDrops)
        }),
        'UNION',
      )

      if (intersectFilters.size === 0) {
        return index.keySet.subtract(subtractSet)
      }

      return intersectSet.subtract(subtractSet)
    },
    {
      cache: cache,
      getCacheKey: (input: [FiltersState['filters'], boolean]) => {
        return JSON.stringify(input)
      },
    },
  )

  function filter(state: FiltersState) {
    const { filters, options } = state
    const f = filters
      .filter(([_, filter]) => {
        return filter.value.length !== 0 && filter.operator !== 'pass'
      })
      .sort((a, b) => {
        const x = a[0]
        const y = b[0]
        return cmp(x, y)
      })
    return filterCache([f, options.eventDrops])
  }

  return {
    index,
    update,
    filter,
  }
}

type TranslationsMap = OrderedMap<string, ImmutableMap<'name' | 'description', string | undefined>>
function useSearch() {
  const index = {
    origin: OrderedMap() as TranslationsMap,
    keys: List<string>(),
  }

  const cache = new LRUCache<string, Set<string>>()

  const searchCache = memoize(
    ([text, searchNameOnly]: [string | null, boolean]) => {
      if (index.origin.size === 0 || isNull(text) || text === '') {
        return index.keys.toSet()
      }
      const pattern = new RegExp(text, 'i')
      return index.keys
        .filter((k) => {
          const name = index.origin.getIn([k, 'name'])
          const testName = !isUndefined(name) && pattern.test(name as string)
          if (searchNameOnly) {
            return testName
          }
          const description = index.origin.getIn([k, 'description'])
          const testDescription = !isUndefined(description) && pattern.test(description as string)
          return testName || testDescription
        })
        .toSet()
    },
    {
      cache: cache,
      getCacheKey: ([text, searchNameOnly]: [string | null, boolean]) =>
        `${text ?? ''}:${searchNameOnly ? 1 : 0}`,
    },
  )

  function search(state: FiltersState) {
    return searchCache([state.search, state.options.searchNameOnly])
  }

  function update(translations: TranslationsPost) {
    // i know what i do
    index.origin = OrderedMap(
      translations.sort(([_x, x], [_y, y]) => {
        return x.name.localeCompare(y.name)
      }),
    ) as unknown as TranslationsMap
    index.keys = index.origin.keySeq().toList()

    cache.clear()
  }

  function isReady() {
    return !isUndefined(index)
  }

  return { index, update, search, isReady }
}

function useSort() {
  const index = {
    sorts: ImmutableMap<string, ImmutableMap<string, StatValue>>(),
  }

  function update(sorts: Array<[string, EntrySearchDoc]>) {
    index.sorts = ImmutableMap(fromJS(sorts)) as unknown as ImmutableMap<
      string,
      ImmutableMap<string, StatValue>
    >
  }

  function sort(ps: List<string>, state: SortsState | undefined) {
    if (isUndefined(state) || state.key === '') {
      return ps
    }
    return ps
      .filter((v) => {
        return v.startsWith(state.category) && !isUndefined(index.sorts.getIn([v, state.key]))
      })
      .sort((x, y) => {
        const a = index.sorts.getIn([x, state.key]) as string | number | boolean | undefined
        const b = index.sorts.getIn([y, state.key]) as string | number | boolean | undefined
        return cmp(a, b) * (state.asc ? 1 : -1)
      })
  }

  return {
    update,
    sort,
  }
}

/// handlers

const searchAction = useSearch()
const filterAction = useFilter()
const sortAction = useSort()

const queryState: {
  filters: FiltersState | undefined
  sorts: SortsState | undefined
} = {
  filters: undefined,
  sorts: undefined,
}

function getPrimarySort() {
  if (queryState.sorts?.primary.startsWith('name.')) {
    if (queryState.sorts?.primary.endsWith('.asc')) {
      return searchAction.index.keys
    } else {
      return searchAction.index.keys.reverse()
    }
  }
  if (queryState.sorts?.primary.startsWith('tier.')) {
    if (queryState.sorts?.primary.endsWith('.asc')) {
      return filterAction.index.tiers
    } else {
      return filterAction.index.tiers.reverse()
    }
  }
  return filterAction.index.keys
}

function query() {
  if (isUndefined(queryState.filters)) {
    const ps = getPrimarySort()
    return sortAction.sort(ps, queryState.sorts)
  }
  const resultFiltered = filterAction.filter(queryState.filters)
  const resultSearched = searchAction.search(queryState.filters)
  const resultCombined = resultFiltered.intersect(resultSearched)
  const ps = getPrimarySort().filter((v) => resultCombined.has(v))

  return sortAction.sort(ps, queryState.sorts)
}

const handleQuery = useDebounceFn((state: { filters: FiltersState; sorts: SortsState }) => {
  queryState.filters = state.filters
  queryState.sorts = state.sorts
  const r = query()
  self.postMessage(r?.toArray())
}, 500)

async function handleQueryIndex(queryIndexPost: QueryIndexPost) {
  const { keys, filters, sorts } = queryIndexPost
  filterAction.update(keys, filters)
  sortAction.update(sorts)
}

function handleSetupI18n(trans: TranslationsPost) {
  searchAction.update(trans)
}

self.onmessage = async (event: MessageEvent<Message<ActionType>>) => {
  const { type, payload } = event.data
  switch (type) {
    case 'setup':
      const { type: setupType, data: setupData } = payload as Actions['setup']
      switch (setupType) {
        case 'index':
          handleQueryIndex(setupData)
          break
        case 'i18n':
          handleSetupI18n(setupData)
          break
      }
      break
    case 'query':
      handleQuery(payload as Actions['query'])
      break
  }
}
