import type { CodexEntryKeys, Filter } from '@/types/filters'
import type { CodexEntry } from './codex'
import type { Status } from '@/types/codex'

export function getFilterResult(entry: CodexEntry, filterKey: CodexEntryKeys, filter: Filter) {
  let srcValue = undefined
  switch (filterKey) {
    case 'element':
      srcValue = entry.element
      break
    default:
      srcValue = entry.raw[filterKey]
  }
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
