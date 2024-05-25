import type { Filters, FiltersState } from '@/types'
import { defineStore } from 'pinia'
import { useCodexState } from './codex'
import { useOptionsState } from './options'
import { global } from '@/plugins/global'

export const useFiltersState = defineStore('filters', {
  state: () => ({
    search: '' as string,
    filters: [] as Filters,
    sort: undefined as string | undefined,
    asc: false,
    multiple: false,
    version: global.filtersVersion as string
  }),
  getters: {
    statsKeys(): Array<string> {
      const codexState = useCodexState()
      const keys = [
        'attack',
        'magic',
        'defense',
        'resistance',
        'dexterity',
        'crit',
        'hp',
        'mana',
        'ward',
        'foresight',
        'orn_bonus',
        'exp_bonus',
        'luck_bonus',
        'gold_bonus',
        'follower_stats',
        'follower_act',
        'summon_stats',
        'view_distance',
        'adornment_slots'
      ]
      const keysSet = new Set(keys)
      return Array.from(
        keys.concat(
          Array.from(codexState.sortKeys)
            .filter((x) => !keysSet.has(x))
            .sort((a, b) => a.localeCompare(b))
        )
      )
    },
    filtersKeys(state) {
      return new Set(state.filters.map(({ key: key }) => key))
    }
  },
  actions: {
    initialize(data?: FiltersState) {
      const optionsState = useOptionsState()
      optionsState.initialize()
      if (data !== undefined && data.version === this.version) {
        this.$patch({
          sort:
            data.sort !== undefined && this.statsKeys.concat(['name', 'tier']).includes(data?.sort)
              ? data.sort
              : undefined,
          filters: data.filters
            .filter((filter) => filter.key in optionsState.options)
            .map(({ key: key, value: value }) => {
              if (Array.isArray(value)) {
                return {
                  key: key,
                  value: value.filter((v) => optionsState.options[key].has(v))
                }
              } else {
                return {
                  key: key,
                  value:
                    value !== undefined && optionsState.options[key].has(value) ? value : undefined
                }
              }
            }),
          asc: data.asc,
          search: data.search,
          multiple: data.multiple
        } as FiltersState)
        this.reset(false)
      } else {
        this.reset()
      }
    },
    reset(init: boolean = true) {
      if (init) {
        const tmp = this.multiple
        this.$reset()
        this.$patch({ multiple: tmp })
      }
      const optionsState = useOptionsState()
      optionsState.resetMenu()
      if (this.filters.length === 0) {
        this.addFilter(0)
      }
    },
    isMultiple(key: string) {
      return this.multiple && key !== 'exotic'
    },
    switchMultiple() {
      const tmp = {
        search: this.search,
        sort: this.sort,
        asc: this.asc,
        version: this.version,
        filters: this.filters.map((filter) => {
          if (filter.key !== 'exotic') {
            if (this.multiple) {
              filter.value = filter.value !== undefined ? [filter.value as string] : []
            } else {
              if (Array.isArray(filter.value)) {
                filter.value = (filter.value as any)[0]
              }
            }
          }
          return filter
        })
      } as FiltersState
      this.reset()
      this.$patch(tmp)
    },
    addFilter(index: number) {
      const optionsState = useOptionsState()
      const key = optionsState.menu[index][0]
      this.filters.push({
        key: key,
        value: this.isMultiple(key) ? [] : undefined
      })
      optionsState.menu[index][1] = false
    }
  }
})
