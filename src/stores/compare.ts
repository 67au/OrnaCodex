import config from '@/config'
import type { CompareQuery, CompareResult } from '@/types/assess'
import type { CodexEntryKey } from '@/types/codex'
import { getFullResult, setQueryInput } from '@/utils/assess'
import { getCodexEntryByKey } from '@/utils/codex'
import { head, inRange, isEmptyObject, isUndefined, mapValues, union, zipObject } from 'es-toolkit'
import { reduce, get, isArray } from 'es-toolkit/compat'

const MAX_CAP = 8
const MAX_QUALITY = 200

export const useCompareState = defineStore(
  'compare',
  () => {
    const list: Ref<Array<CompareQuery>> = ref([])
    const count = computed(() => list.value.length)

    function add(key: CodexEntryKey) {
      if (count.value < MAX_CAP) {
        const entry = getCodexEntryByKey(key)
        if (isUndefined(entry)) {
          return false
        }
        list.value.push({
          key: entry.key,
          quality: MAX_QUALITY,
          qualityCode: -1,
          level: entry.isUpgradable ? 13 : 1,
          bossScaling: entry.bossScaling,
          angLevel: 0,
        })
        return true
      }

      return false
    }

    function remove(index: number) {
      return !isUndefined(list.value.splice(index, 1))
    }

    function leftShift(index: number) {
      if (inRange(index, 1, count.value)) {
        ;[list.value[index - 1], list.value[index]] = [
          list.value[index],
          list.value[index - 1],
        ] as [CompareQuery, CompareQuery]
      }
    }

    function reset() {
      list.value = []
    }

    const results = computed(() => {
      return list.value.map((c) => {
        const entry = getCodexEntryByKey(c.key)
        if (isUndefined(entry)) {
          return undefined
        }
        const q = Object.assign(setQueryInput(entry), c)
        return {
          ...getFullResult(q),
          entry: entry,
        }
      })
    })

    const keys = computed(() => {
      return reduce(
        results.value.filter((r) => !isUndefined(r)),
        (acc, r) => {
          return union(acc, Object.keys(r.stats))
        },
        Array<string>(),
      ).sort((a, b) => {
        const orderMap = config.baseStatMap
        const ia = config.baseStatMap.get(a)
        const ib = orderMap.get(b)
        if (ia === ib) {
          return 0
        }
        return (ia ?? Infinity) - (ib ?? Infinity)
      })
    })

    const comparedResults: ComputedRef<Array<CompareResult | undefined>> = computed(() => {
      if (count.value === 0) {
        return []
      }

      const firstItem = head(results.value)

      // if first blocked
      if (isUndefined(firstItem) || isEmptyObject(firstItem.stats)) {
        return results.value.map((r) => {
          if (isUndefined(r)) {
            return undefined
          }
          return {
            ...r,
            stats: mapValues(r.stats, (v) => ({ base: v, diff: 0 })),
          }
        })
      }

      // different result
      const diffResults = results.value.map((r, index) => {
        if (isUndefined(r)) {
          return undefined
        }

        if (index === 0) {
          const result = {
            ...r,
            stats: zipObject(
              keys.value,
              keys.value.map((k) => ({
                base: get(firstItem.stats, k),
                diff: 0,
              })),
            ),
          }
          return result as CompareResult
        } else {
          const stats = zipObject(
            keys.value,
            keys.value.map((k) => {
              const baseValue = get(r.stats, k)
              const firstValue = get(firstItem.stats, k)
              const disableDiff = firstItem.quality <= 0
              if (
                typeof baseValue === 'string' ||
                isArray(baseValue) ||
                typeof firstValue === 'string' ||
                isArray(firstValue)
              ) {
                return {
                  base: baseValue,
                  diff: 0,
                }
              }
              if (typeof baseValue === 'boolean' || typeof firstValue === 'boolean') {
                return {
                  base: isUndefined(baseValue) ? false : baseValue,
                  diff: 0,
                }
              }
              return {
                base: baseValue,
                diff: disableDiff ? 0 : (baseValue ?? 0) - (firstValue ?? 0),
              }
            }),
          )

          return {
            ...r,
            stats: stats,
          }
        }
      })

      return diffResults
    })

    return {
      list,
      count,
      results,
      keys,
      comparedResults,
      add,
      remove,
      leftShift,
      reset,
    }
  },
  {
    persistedState: {
      persist: true,
    },
  },
)
