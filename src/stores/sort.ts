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
      sort: {
      name: undefined as string | undefined,
      asc: false,
      },
    }) as SortState,
  getters: {
    keys(state) {
      const optionsState = useOptionsState()
      return optionsState.sortKeys
    },
    nameTuple(state) {
      return state.sort.name === undefined ? undefined : getNameTuple(state.sort.name)
    }
  },
  actions: {
    reset() {
      this.$reset()
    }
  },
  persistedState: {
    persist: true,
    deserialize: (value: string) => {
      return JSON.parse(value) as SortState
    },
  }
})
