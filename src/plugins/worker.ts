import type { Status } from '@/types/codex'
import type { CodexEntryKeys, Filter } from '@/types/filters'
import type { Command, CommandMap } from '@/types/worker'
import { head, isUndefined } from 'es-toolkit'
import { useDebounceFn } from '@vueuse/core'
import { get } from 'es-toolkit/compat'

const data: {
  codex: CommandMap['INIT']
  i18n: CommandMap['I18N']
  filters: CommandMap['FILTER']['filters'] | undefined
  filterOptions: CommandMap['FILTER']['options'] | undefined
  search: CommandMap['FILTER']['search'] | undefined
  sort: CommandMap['SORT'] | undefined
} = {
  codex: {},
  i18n: {},
  filters: undefined,
  filterOptions: undefined,
  search: undefined,
  sort: undefined,
}

const spell_key_pattern = /^\+.*(spell|skill)$/

function isSpellKey(key: string): boolean {
  return spell_key_pattern.test(key)
}

export function getFilterResult(key: string, filterKey: CodexEntryKeys, filter: Filter) {
  let srcValue = undefined
  switch (filterKey) {
    case 'element':
      srcValue = data.codex[key]?.stats?.element
      break
    case 'two_handed':
      if (data.codex[key]?.item_type === 'weapon') {
        srcValue = data.codex[key]?.stats?.two_handed || false
      } else {
        srcValue = undefined
      }
      break
    default:
      srcValue = data.codex[key]?.[filterKey]
  }
  if (isSpellKey(filterKey)) {
    srcValue = data.codex[key]?.stats?.[filterKey]
  }
  if (data.filterOptions?.eventItems && filterKey === 'events' && key.startsWith('items/')) {
    srcValue = [
      ...new Set(
        data.codex[key]?.dropped_by?.flatMap((entry) => data.codex[entry.join('/')]?.events ?? []),
      ),
    ]
  }
  ///
  if (srcValue === undefined) {
    return false
  }
  if (Array.isArray(srcValue)) {
    const testValue = (srcValue as Array<string | Status>).map((s) =>
      typeof s === 'string' ? s : s.name,
    )
    for (const v of filter.value) {
      if (testValue.includes(v)) {
        return !filter.exclude
      }
    }
    return filter.exclude
  } else {
    const testValue = srcValue as string
    return filter.value.includes(testValue) ? !filter.exclude : filter.exclude
  }
}

const regex_strip_percent_and_plus = /%|\+/gi

function getSortValue(key: string, sortKey: string) {
  const r = get(data.codex[key], sortKey)
  if (r === undefined) {
    return undefined
  }
  if (typeof r === 'boolean') {
    return r ? 1 : -1
  }
  if (typeof r === 'number') {
    return r
  }
  const s = r.replaceAll(regex_strip_percent_and_plus, '')
  return Number(head(s.split(' ')))
}

function useCodexList() {
  return Object.keys(data.codex)
}

function useSearch() {
  const list = useCodexList()
  if (isUndefined(data.search)) {
    return list
  } else {
    const searchPattern = new RegExp(data.search!, 'i')
    return list.filter((key) => {
      return (
        searchPattern.test(data.i18n[key]!.name) ||
        (data.i18n[key]!.description && searchPattern.test(data.i18n[key]!.description))
      )
    })
  }
}

function useFilter() {
  const list = useSearch()
  if (isUndefined(data.filters)) {
    return list
  }
  return (Object.entries(data.filters!) as Array<[CodexEntryKeys, Filter]>).reduce(
    (tmp, [key, filter]) => {
      return tmp.filter((entry) => {
        if (filter.value.length === 0) {
          return true
        }
        return getFilterResult(entry, key, filter)
      })
    },
    list,
  )
}
function useDefaultSort() {
  const list = useFilter()
  if (data.sort === undefined) {
    return list
  }
  const { key, asc } = data.sort.primary
  if (key === 'name') {
    return list.sort(
      (a, b) => data.i18n[a]!.name.localeCompare(data.i18n[b]!.name) * (asc ? 1 : -1),
    )
  }
  if (key === 'tier') {
    return list.sort(
      (a, b) =>
        ((data.codex[a]!.tier as number) - (data.codex[b]!.tier as number)) * (asc ? 1 : -1),
    )
  }
  return list
}

function useSort() {
  const list = useDefaultSort()
  if (isUndefined(data.sort) || data.sort!.key === '') {
    return list
  } else {
    const tmp = list.filter((key) => data.codex?.[key]?.category === data.sort?.category)
    return tmp
      .map((key, i) => {
        return { i, value: getSortValue(key, data.sort!.key) }
      })
      .sort((a, b) => {
        if (a.value === undefined) {
          return 1
        }
        if (b.value === undefined) {
          return -1
        }
        return (a.value - b.value) * (data.sort!.asc ? 1 : -1)
      })
      .map((elem) => tmp[elem.i])
  }
}

const output = useDebounceFn(() => useSort(), 1000)

self.onmessage = async (event: MessageEvent<Command>) => {
  const cmd = event.data
  switch (cmd.type) {
    case 'INIT':
      data.codex = cmd.payload as CommandMap['INIT']
      break
    case 'I18N':
      data.i18n = cmd.payload as CommandMap['I18N']
      break
    case 'FILTER':
      const payload = cmd.payload as CommandMap['FILTER']
      data.filters = payload.filters
      data.filterOptions = payload.options
      data.search = payload.search
      self.postMessage(await output())
      break
    case 'SORT':
      data.sort = cmd.payload as CommandMap['SORT']
      self.postMessage(await output())
      break
  }
}
