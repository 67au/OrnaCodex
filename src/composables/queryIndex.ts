import type { SearchGroup } from '@/types/filters'
import type { CodexEntry } from '@/utils/codex'
import { isUndefined, mapValues } from 'es-toolkit'
import { useAppStorage } from './storage'
import type { IndexJson, QueryIndexPost } from '@/types/worker'
import { useCodexState } from '@/stores/codex'
import { get, isArray } from 'es-toolkit/compat'
import type { EntrySearchDoc } from '@/types/codex'

const persisted = useAppStorage('persisted')

function indexToJson(index: Record<string, SearchGroup>): IndexJson {
  return mapValues(index, (groups) => {
    return Array.from(groups)
      .map(([key, group]) => [key, Array.from(group)] as [string | number, Array<string>])
      .sort(([x, _x], [y, _y]) => {
        if (x === y) {
          return 0
        }
        if (typeof x === 'number') {
          return x - (y as number)
        }
        if (typeof x === 'string') {
          return x.localeCompare(y as string)
        }
        return 0
      })
  })
}

const skipKeys = new Set(['key', 'id'])

export function buildQueryIndex<T extends EntrySearchDoc>(list: Array<T>) {
  const indexKeys = new Set<string>()
  list.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (skipKeys.has(key)) {
        return
      }
      indexKeys.add(key)
    })
  })

  const index: Record<string, SearchGroup> = {}

  indexKeys.forEach((k) => {
    index[k] = new Map() as SearchGroup
  })

  list.forEach((item: T) => {
    indexKeys.forEach((k) => {
      const value = get(item, k)
      if (isUndefined(value)) {
        return
      }
      if (typeof value === 'boolean') {
        return
      }

      const group = get(index, k)

      if (isUndefined(group)) {
        return
      }

      if (isArray(value)) {
        value.forEach((v) => {
          const name = typeof v === 'string' ? v : v.name
          if (!group.has(name)) {
            group.set(name, new Set())
          }
          group.get(name)?.add(item.key)
        })
      } else {
        if (!group.has(value)) {
          group.set(value, new Set())
        }
        group.get(value)?.add(item.key)
      }
    })
  })

  return index
}

export function useBuildQueryIndex() {
  const savedName = 'query_index'
  const index = {
    keys: Array<string>(),
    filters: {},
    sorts: Array<[string, EntrySearchDoc]>(),
  }

  function update(entries: Array<CodexEntry>) {
    index.filters = buildQueryIndex(entries.map((entry) => entry.toSearchDoc()))
    index.sorts = entries
      .map((entry) => [entry.key, entry.toSortDoc()])
      .filter(([_, v]) => !isUndefined(v)) as Array<[string, EntrySearchDoc]>
    index.keys = entries.map((entry) => entry.key)
  }

  function toJson() {
    return {
      filters: indexToJson(index.filters),
      sorts: index.sorts,
    }
  }

  async function save() {
    await persisted.setItem(savedName, toJson())
    return true
  }

  async function clear() {
    await persisted.removeItem(savedName)
    return true
  }

  async function buildIndex(): Promise<QueryIndexPost | null> {
    const codexState = useCodexState()
    if (codexState.entries.size === 0) {
      return null
    }
    const r = await persisted.getItem(savedName)
    if (isUndefined(r)) {
      update(Array.from(codexState.entries.values()))
      await save()
    }
    return {
      keys: Array.from(codexState.entries.values()).map((entry) => entry.key),
      ...(r ?? toJson()),
    } as QueryIndexPost
  }

  return {
    update,
    save,
    clear,
    buildIndex,
  }
}
