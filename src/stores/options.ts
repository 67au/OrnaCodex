import { defineStore } from 'pinia'
import { useCodexState } from './codex'
import type { Options, Status } from '@/types'
import { useFiltersState } from './filters'

export const useOptionsState = defineStore('options', {
  state: () => ({
    options: {} as Options
  }),
  getters: {
    keys(): {
      single: Array<string>
      array: Array<string>
      status: Array<string>
    } {
      return {
        single: [
          'category',
          'tier',
          'exotic',
          'rarity',
          'useable_by',
          'family',
          'spell_type',
          'item_type',
          'place',
          'target'
        ],
        array: ['event', 'tags'],
        status: ['causes', 'cures', 'gives', 'immunities']
      }
    },
    singleKeysSet() {
      return new Set((this.keys as any).single)
    },
    arrayKeysSet() {
      return new Set((this.keys as any).array)
    },
    statusKeysSet() {
      return new Set((this.keys as any).status)
    }
  },
  actions: {
    initialize() {
      const codexState = useCodexState()
      this.$reset()
      const options = Object.fromEntries(
        Object.values(this.keys).flatMap((keys) =>
          keys.map((key) => {
            return [key, new Set()]
          })
        )
      )
      Object.values(codexState.meta).forEach((entries) => {
        Object.values(entries).forEach((entry) => {
          Object.keys(options).forEach((key) => {
            if (Array.isArray(entry[key])) {
              entry[key].forEach((t: string | Status) => {
                if (typeof t === 'string') {
                  options[key].add(t)
                } else {
                  options[key].add(t.name)
                }
              })
            } else {
              if (entry[key] !== undefined) {
                options[key].add(entry[key])
              }
            }
          })
        })
      })
      this.$patch({ options: options })
    }
  }
})
