import { global } from '@/plugins/global'
import type { SortState } from '@/types'
import { defineStore } from 'pinia'
import { useCodexState } from './codex'

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
    statsKeys(): Array<string> {
      const codexState = useCodexState()
      return Array.from(
        keys.concat(
          Array.from(codexState.sortKeys)
            .filter((x) => !keysSet.has(x))
            .sort((a, b) => a.localeCompare(b))
        )
      )
    }
  },
  actions: {
    initialize(data?: SortState) {
      if (data !== undefined && data.version === this.version) {
        this.$patch({
          name:
            data.name !== undefined && this.statsKeys.concat(['name', 'tier']).includes(data?.name)
              ? data.name
              : undefined,
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
