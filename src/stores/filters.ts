import type { Filters } from '@/types'
import { defineStore } from 'pinia'
import { useOptionsState } from './options'
import { global } from '@/plugins/global'
import { deserialize, serialize } from '@/plugins/filters'

export const useFiltersState = defineStore('filters', {
  state: () => ({
    search: '' as string,
    filters: new Map() as Filters,
    multiple: false,
  }),
  getters: {
    filtersKeys(state) {
      return new Set(state.filters.keys())
    }
  },
  actions: {
    reset() {
      const keep = { multiple: this.multiple }
      this.$reset()
      this.$patch(keep)
    },
    switchMultiple() {
      const tmp = {
        search: this.search,
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
      const type = optionsState.getOptionsType(key)
      if (type !== undefined) {
        this.filters.set(key, {
          value: this.multiple ? [] : undefined,
          type: type
        })
      }
    },
    removeFilter(key: string) {
      this.filters.delete(key)
    }
  },
  persistedState: {
    persist: true,
    deserialize: (value: string) => {
      return deserialize(value)
    },
    serialize: (value) => {
      return serialize(value)
    }
  }
})
