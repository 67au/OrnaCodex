import type { CodexEntry } from './codex'
import { useSortState } from '@/stores/sort'
import { get } from 'es-toolkit/compat'
import type { SortValueType } from '@/types/filters'
import { getStripedValue } from '.'

const sortState = useSortState()

export function getSortValue(entry: CodexEntry, type: SortValueType, key: string) {
  const raw = get(entry.raw, key)
  if (raw === undefined) {
    return undefined
  }
  if (type === 'BOOL') {
    return raw
  } else {
    return getStripedValue(raw)
  }
}

export function getSortResult(entries: Array<CodexEntry>) {
  const tmp = entries.filter((entry) => entry.category === sortState.category)
  return tmp
    .map((elem, i) => {
      return { i, value: getSortValue(elem, sortState.type!, sortState.key) }
    })
    .sort((a, b) => {
      if (a.value === undefined) {
        return 1
      }
      if (b.value === undefined) {
        return -1
      }
      return (a.value - b.value) * (sortState.asc ? 1 : -1)
    })
    .map((elem) => tmp[elem.i])
}
