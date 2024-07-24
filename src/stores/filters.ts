import type { Filters, FiltersStorage } from '@/types'
import { defineStore } from 'pinia'
import { useOptionsState } from './options'
import { global } from '@/plugins/global'

export const useFiltersState = defineStore('filters', {
  state: () => ({
    search: '' as string,
    filters: new Map() as Filters,
    multiple: false,
    version: global.filtersVersion as string
  }),
  getters: {
    filtersKeys(state) {
      return new Set(state.filters.keys())
    },
    storage(state): FiltersStorage {
      return {
        search: state.search,
        filters: Array.from(state.filters),
        multiple: state.multiple,
        version: state.version
      }
    }
  },
  actions: {
    initialize(data?: FiltersStorage) {
      const optionsState = useOptionsState()
      optionsState.initialize()
      if (data !== undefined && data.version === this.version) {
        this.$patch({
          filters: new Map(
            data.filters
              .filter(([key, _]) => key in optionsState.options)
              .map(([_, { key: key, value: value }]) => {
                return [
                  key,
                  {
                    key: key,
                    value: Array.isArray(value)
                      ? value.filter((v) => optionsState.options[key].has(v))
                      : value !== undefined && optionsState.options[key].has(value)
                        ? value
                        : undefined
                  }
                ]
              })
          ),
          search: data.search,
          multiple: data.multiple,
          version: data.version
        })
      } else {
        this.reset()
      }
    },
    reset() {
      const keep = { multiple: this.multiple }
      this.$reset()
      this.$patch(keep)
    },
    switchMultiple() {
      const tmp = {
        search: this.search,
        version: this.version,
        filters: new Map(
          Array.from(this.filters).map(([key, filter]) => {
            if (this.multiple) {
              filter.value = filter.value !== undefined ? [filter.value as string] : []
            } else {
              if (Array.isArray(filter.value)) {
                filter.value = (filter.value as any)[0]
              }
            }
            return [key, filter]
          })
        )
      }
      this.reset()
      this.$patch(tmp)
    },
    addFilter(key: string) {
      const optionsState = useOptionsState()
      this.filters.set(key, {
        key: key,
        value: this.multiple ? [] : undefined,
        type: optionsState.getOptionsType(key)
      })
    },
    removeFilter(key: string) {
      this.filters.delete(key)
    }
  }
})
