import { getPercent, getSignedNumber, getSignedPercent, getStripedValue } from '@/plugins'
import {
  bonusKeySet,
  getQualityBonus,
  getQualityCode,
  useAssessQuery,
  useAssessResult,
} from '@/plugins/assess'
import { CodexEntry, CodexEntryFactory } from '@/plugins/codex'
import type { CompareQuery, CompareResult } from '@/types/compare'
import { isUndefined, mapValues, union, zipObject } from 'es-toolkit'
import { reduce } from 'es-toolkit/compat'
import { useCodexState } from './codex'
import { i18n } from '@/i18n'
import type { SortValueType } from '@/types/filters'

const MAX_CAP = 8
const anguishedBonusKeySet = new Set(['follower_stats', 'summon_stats'])
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
      ;[list.value[index - 1], list.value[index]] = [list.value[index], list.value[index - 1]]
    }

    function $reset() {
      list.value = []
    }

    const assessResult = computed(() =>
      list.value.map((v) => {
        const assessQuery = useAssessQuery(v.entry, true)
        assessQuery.query.quality = v.query.quality
        assessQuery.query.angLevel = v.query.angLevel
        assessQuery.options.bossScaling = v.query.bossScaling
        return useAssessResult(assessQuery)
      }),
    )

    const baseStatKeyMap = computed(() => {
      return new Map(codexState.baseStats.map((k, i) => [k, i]))
    })

    const keys = computed(() => {
      const k = reduce(
        assessResult.value,
        (acc, v, index) => {
          return union(
            union(acc, Object.keys(v.stats)),
            Object.keys(list.value[index].entry.raw.stats ?? {}),
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

    const baseResult = computed(() => {
      return assessResult.value.map((v, index) => {
        const q = list.value[index]
        const result: {
          entry: CodexEntry
          quality: number
          stats: Record<string, string | number>
        } = {
          entry: q.entry,
          quality: v.quality,
          stats: {},
        }

        if (v.quality === 0) {
          return result
        }

        const stats: Array<string | number> = keys.value.map((k) => {
          const s = q.entry.raw?.stats?.[k]
          if (k === 'element') {
            return isUndefined(s)
              ? '-'
              : (s as unknown as Array<string>).map((e) => i18n.global.t('element.' + e)).join(', ')
          }
          if (baseStatKeyMap.value.has(k) && v.stats[k] !== undefined) {
            return v.stats[k].values[q.query.level - 1] as number
          }
          if (typeof s === 'boolean') {
            return s ? 1 : 0
          }
          const stat = getStripedValue(s ?? 0)
          if (bonusKeySet.has(k)) {
            return getQualityBonus(
              stat,
              q.query.qualityCode > -1
                ? q.query.qualityCode
                : getQualityCode(q.query.quality / 100, q.query.level, q.entry.isAccessory),
              q.entry.isAdornment,
              k,
            )
          }
          if (v.angLevel > 0 && stat !== 0 && anguishedBonusKeySet.has(k)) {
            return stat + v.angLevel * 3
          }
          return stat
        })

        result.stats = zipObject(keys.value, stats) as Record<string, string | number>
        return result
      })
    })

    function getBaseValue(base: string | number, type: SortValueType): string {
      switch (type) {
        case 'BOOL':
          return (base === 0 ? '-' : '★').toString()
        case 'NUMBER':
          return base.toString()
        case 'SIGNED_NUMBER':
          return getSignedNumber(base as number)
        case 'PERCENT':
          return getPercent(base as number)
        case 'SIGNED_PERCENT':
          return getSignedPercent(base as number)
        default:
          return base.toString()
      }
    }

    const comparedResult: Ref<Array<CompareResult>> = computed(() => {
      if (count.value < 1) {
        return []
      }
      const first = baseResult.value[0]

      const other = baseResult.value.slice(1).map((v) => {
        if (first.quality === 0 || v.quality === 0) {
          return {
            entry: v.entry,
            quality: v.quality,
            stats: {},
          }
        }

        return {
          entry: v.entry,
          quality: v.quality,
          stats: mapValues(v.stats, (value, k) => {
            const type = codexState.sorts?.['items']?.['stats.' + k] ?? 'NUMBER'
            const firstValue = first.stats[k]
            if (k === 'element') {
              return {
                base: value as string,
                diff: 0,
              }
            }
            if (type === 'BOOL') {
              return {
                base: getBaseValue(value, type),
                diff: 0,
              }
            }
            return {
              base: getBaseValue(value, type),
              diff: (value as number) - (firstValue as number),
            }
          }),
        }
      })

      const _first = {
        entry: first.entry,
        quality: first.quality,
        stats: mapValues(first.stats, (value, k) => {
          const type = codexState.sorts?.['items']?.['stats.' + k] ?? 'NUMBER'
          return {
            base: getBaseValue(value, type),
          }
        }),
      }

      return [_first, ...other]
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
