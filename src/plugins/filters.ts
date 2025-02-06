import type { CodexEntry, Filter, Status } from '@/types'

export function getFilterResult(
  entry: CodexEntry,
  filterKey: string,
  filter: Filter,
  multiple: boolean
) {
  let srcValue
  switch (filterKey) {
    case 'gear_element':
      srcValue = entry?.stats?.element
      break
    default:
      srcValue = entry[filterKey]
  }
  if (srcValue === undefined) {
    return false
  }
  if (Array.isArray(srcValue)) {
    const testValue: Array<string> = srcValue.map((s: string | Status) =>
      typeof s === 'string' ? s : s.name
    )
    if (multiple) {
      for (const v of filter.value || []) {
        if (testValue.includes(v)) {
          return true
        }
      }
      return false
    } else {
      return testValue.includes(filter.value as string)
    }
  } else {
    const testValue: string = srcValue
    if (multiple) {
      return filter.value?.includes(testValue)
    } else {
      return testValue === filter.value
    }
  }
}

export function deserialize(value: string) {
  const json = JSON.parse(value)
  return { ...json, filters: new Map(json.filters) }
}

export function serialize(value: any) {
  return JSON.stringify({ ...value, filters: Array.from(value.filters) })
}
