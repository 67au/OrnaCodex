import type { PrimarySortKeys } from '@/types/filters'
import { useCodexState } from './codex'
import { last } from 'es-toolkit'

export const useSortState = defineStore(
  'sort',
  () => {
    const codexState = useCodexState()

    const category = ref('')
    const key = ref('')
    const asc = ref(false)
    const primary: Ref<PrimarySortKeys> = ref('default')

    const isActive = computed(() => key.value !== '')
    const shortKey = computed(() => last(key.value.split('.')) ?? '')
    const type = computed(() => codexState.sorts?.[category.value]?.[key.value])
    const isBool = computed(() => isActive.value && type.value === 'BOOL')
    const baseStatsMap = computed(
      () => new Map(codexState.baseStats.map((a, index) => [`stats.${a}`, index])),
    )
    const lastStat = computed(() => {
      const s = last(codexState.baseStats)
      if (s === undefined) {
        return undefined
      } else {
        return 'stats.' + s
      }
    })

    function $reset() {
      category.value = ''
      key.value = ''
      asc.value = false
      // primary.value = 'default'
    }

    return {
      category,
      key,
      asc,
      primary,
      type,
      isActive,
      isBool,
      shortKey,
      baseStatsMap,
      lastStat,
      $reset,
    }
  },
  {
    persistedState: {
      persist: true,
    },
  },
)
