import type { CodexEntryKeys, Filters } from '@/types/filters'

export const useFiltersState = defineStore(
  'filters',
  () => {
    const _state: { filters: Filters } = reactive({
      filters: {},
    })
    const filters: ComputedRef<Filters> = computed(() => _state.filters)
    const search: Ref<string | null> = ref(null)

    function $reset() {
      _state.filters = {}
      search.value = null
    }

    const keys = computed(() => {
      return Object.keys(_state.filters)
    })

    function setFilter(key: CodexEntryKeys) {
      if (_state.filters[key] === undefined) {
        _state.filters[key] = {
          value: [],
          exclude: false,
        }
      } else {
        delete _state.filters[key]
      }
    }

    return { _state, filters, search, keys, setFilter, $reset }
  },
  {
    persistedState: {
      persist: true,
    },
  },
)
