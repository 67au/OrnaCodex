import type { AssessQuery, AssessResult, ComparedEntry } from '@/types'
import { defineStore } from 'pinia'

const ENTRIES_MAX = 6
const compareSkipKeysSet = new Set(['element'])

export const useCompareState = defineStore('compare', {
  state: () => ({
    list: Array<ComparedEntry>()
  }),
  getters: {
    length: (state) => state.list.length,
    assess(state) {
      return state.list.map(({ entry: entry, query: query }) => {
        const ar: AssessQuery = entry.assessQuery(true)
        ar.data.quality = Number(query.quality)
        ar.extra.isBoss = query.isBoss
        ar.data.level = query.level
        return entry.assess(ar) as AssessResult
      })
    },
    keys(state) {
      const keysSet: Set<string> = new Set()
      state.list.forEach(({ entry: entry }) => {
        Object.keys(entry.meta.stats || {}).forEach((key) => {
          keysSet.add(key)
        })
        if (entry.isUpgradableSlots) {
          keysSet.add('adornment_slots')
        }
      })
      return Array.from(keysSet).filter((x) => !compareSkipKeysSet.has(x))
    }
  },
  actions: {
    add(entry: ComparedEntry) {
      if (this.list.length < ENTRIES_MAX) {
        this.list.push(entry)
        return true
      } else {
        return false
      }
    },
    remove(index: number) {
      this.list.splice(index, 1)
    },
    leftShift(index: number) {
      ;[this.list[index - 1], this.list[index]] = [this.list[index], this.list[index - 1]]
    }
  }
})
