import type { CodexEntryKeys, FilterOptions, Filters } from '@/types/filters'

const defaultOptions: FilterOptions = {
  eventItems: false,
}

export const useFiltersState = defineStore(
  'filters',
  () => {
    const _state: { filters: Filters; options: FilterOptions } = reactive({
      filters: {},
      options: { ...defaultOptions },
    })
    const filters: ComputedRef<Filters> = computed(() => _state.filters)
    const search: Ref<string | null> = ref(null)
    const options: ComputedRef<FilterOptions> = computed(() => _state.options)
    const optionKeys = computed(() => {
      return Object.keys(_state.options).filter((k) => _state.options[k as keyof FilterOptions])
    })

    function $reset() {
      _state.filters = {}
      // _state.options = { ...defaultOptions }
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

    return { _state, filters, options, search, keys, optionKeys, setFilter, $reset }
  },
  {
    persistedState: {
      persist: true,
    },
  },
)
