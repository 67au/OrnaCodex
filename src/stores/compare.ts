import { getStripedValue } from '@/plugins'
import { getDisableQueryFlag, useQualityResult } from '@/plugins/assess'
import { CodexEntry, CodexEntryFactory } from '@/plugins/codex'
import type { CompareQuery, CompareResult } from '@/types/compare'
import { isUndefined, mapValues, union, zipObject } from 'es-toolkit'
import { first, reduce } from 'es-toolkit/compat'
import { useCodexState } from './codex'
import { getStatType } from '@/plugins/sort'
import type { StatValue } from '@/types/codex'
import type { QualityResult } from '@/types/assess'

const MAX_CAP = 8
const codexState = useCodexState()

export const useCompareState = defineStore(
  'compare',
  () => {
    const list: Ref<Array<CompareQuery>> = ref([])
    const count = computed(() => list.value.length)

    function add(id: string) {
      if (count.value < MAX_CAP) {
        const entry = CodexEntryFactory.getEntry('items', id)
        list.value.push({
          entry: entry,
          query: {
            quality: 200,
            level: entry.isUpgradable ? 13 : 1,
            bossScaling: entry.bossScaling,
            qualityCode: -1,
            angLevel: 0,
          },
        })
        return true
      } else {
        return false
      }
    }
    function remove(index: number) {
      list.value.splice(index, 1)
    }
    function leftShift(index: number) {
      if (index <= 0 || index >= count.value) return
      ;[list.value[index - 1], list.value[index]] = [list.value[index]!, list.value[index - 1]!]
    }

    function $reset() {
      list.value = []
    }

    const baseResult = computed(() =>
      list.value.map((v) => {
        return useQualityResult(v)
      }),
    )

    const baseStatKeyMap = computed(() => {
      return new Map(codexState.baseStats.map((k, i) => [k, i]))
    })

    const keys = computed(() => {
      const k = reduce(
        baseResult.value.filter((r) => !getDisableQueryFlag(r.entry, r.query)),
        (acc, v, index) => {
          return union(
            union(acc, Object.keys(v.stats)),
            Object.keys(list.value?.[index]?.entry.raw.stats ?? {}),
          )
        },
        [] as Array<string>,
      ).sort(
        (a, b) =>
          (baseStatKeyMap.value.has(a) ? baseStatKeyMap.value.get(a)! : Infinity) -
          (baseStatKeyMap.value.has(b) ? baseStatKeyMap.value.get(b)! : Infinity),
      )
      return k
    })

    const comparedResult: ComputedRef<Array<CompareResult>> = computed(() => {
      const firstItem = first(baseResult.value)
      if (isUndefined(firstItem)) {
        return []
      }

      const firstItemStats = zipObject(
        keys.value,
        keys.value.map((k) => {
          const stat = firstItem.stats[k]
          const type = getStatType(firstItem.entry.category, 'stats.' + k)
          if (isUndefined(type) || type === 'TEXT' || type === 'BOOL') {
            return stat
          }
          return getStripedValue(stat as string | number | undefined)
        }),
      )
      const diffResult: Array<CompareResult> = baseResult.value.map(
        (r: QualityResult, index: number) => {
          const result = {
            entry: r.entry,
            quality: r.query.level,
            stats: {},
          }
          if (getDisableQueryFlag(r.entry, r.query)) {
            return result
          }
          if (getDisableQueryFlag(firstItem.entry, firstItem.query) && index !== 0) {
            result.stats = mapValues(r.stats, (value: StatValue) => {
              return { base: value }
            })
            return result
          }
          if (index === 0) {
            result.stats = zipObject(
              keys.value,
              keys.value.map((k) => {
                return {
                  base: r.stats[k],
                }
              }),
            )
          } else {
            result.stats = zipObject(
              keys.value,
              keys.value.map((k) => {
                const stat = r.stats[k]
                const type = getStatType(r.entry.category, 'stats.' + k)
                if (isUndefined(type) || type === 'TEXT') {
                  return {
                    base: stat,
                    diff: 0,
                  }
                }
                if (type === 'BOOL' || typeof stat === 'boolean') {
                  return {
                    base: isUndefined(stat) ? false : (stat as boolean),
                    diff: 0,
                  }
                }
                const baseValue = getStripedValue((stat as string | number | undefined) ?? 0)
                const firstValue = firstItemStats[k] as number
                return {
                  base: baseValue,
                  diff: baseValue - firstValue,
                }
              }),
            )
          }
          return result
        },
      )
      return diffResult
    })

    return { list, count, add, remove, leftShift, comparedResult, keys, $reset }
  },
  {
    persistedState: {
      persist: true,
      deserialize: (value) => {
        return {
          list: JSON.parse(value).list.map((v: { entry: CodexEntry }) => {
            return {
              ...v,
              entry: CodexEntryFactory.getEntry(v.entry.category, v.entry.id),
            }
          }),
        }
      },
      serialize: (value) => {
        return JSON.stringify(value)
      },
    },
  },
)
