import { defineStore } from 'pinia'
import { useCodexState } from './codex'
import type { BestialBond, CodexEntry, Options, Status } from '@/types'

export const useOptionsState = defineStore('options', {
  state: () => ({
    options: {} as Options,
    sortKeys: {
      'items.stats': new Set([
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
      ]),
      'items.extra': new Set(),
      'followers.stats': new Set(),
      raids: new Set(['hp'])
    } as Record<string, Set<string>>
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
          'target',
          'gear_element'
        ],
        array: ['event', 'tags', 'abilities'],
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
              } else {
                if (
                  key === 'gear_element' &&
                  entry.stats !== undefined &&
                  entry.stats.element !== undefined
                ) {
                  options[key].add(entry.stats.element)
                }
              }
            }
          })

          this.collect(entry)
        })
      })
      this.$patch({ options: options })
    },
    collect(entry: CodexEntry) {
      if (entry.category === 'items') {
        Object.keys(entry.stats || []).forEach((key) => {
          if (!this.sortKeys['items.stats'].has(key) && key !== 'element') {
            this.sortKeys['items.extra'].add(key)
          }
        })
      }
      if (entry.category === 'followers') {
        Object.keys(entry.stats || []).forEach((key) => {
          this.sortKeys['followers.stats'].add(key)
        })
      }
    }
  }
})
