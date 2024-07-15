import { global } from '@/plugins/global'
import type { SortState } from '@/types'
import { defineStore } from 'pinia'
import { useOptionsState } from './options'
import { getNameTuple } from '@/plugins/utils'

export const useSortState = defineStore('sort', {
  state: () =>
    ({
      default: {
        name: 'default',
        asc: false
      },
      name: undefined as string | undefined,
      asc: false,
      version: global.filtersVersion as string
    }) as SortState,
  getters: {
    keys(state) {
      const optionsState = useOptionsState()
      return optionsState.sortKeys
    },
    nameTuple(state) {
      return state.name === undefined ? undefined : getNameTuple(state.name)
    }
  },
  actions: {
    initialize(data?: SortState) {
      if (data !== undefined && data.version === this.version) {
        this.$patch({
          name: data.name,
          asc: data.asc,
          default: data.default,
          version: data.version
        })
      }
    },
    reset() {
      this.$reset()
    }
  }
})
