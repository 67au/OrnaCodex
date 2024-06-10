import { CodexEntry } from '@/plugins/codex'
import { defineStore } from 'pinia'

const MAX_LENGTH = 30

export const useHistoryState = defineStore('history', {
  state: () => ({
    list: Array<CodexEntry>(),
    keys: new Set() as Set<string>
  }),
  getters: {
    history(state) {
      return [...state.list].reverse()
    }
  },
  actions: {
    initialize(data: Array<CodexEntry>) {
      this.list = data
        .map((e) => new CodexEntry(e.category, e.id))
        .filter((e) => e.meta !== undefined)
      this.keys = new Set(this.list.map((entry) => entry.url))
    },
    add(entry: CodexEntry) {
      if (!this.keys.has(entry.url)) {
        if (!(this.list.length < MAX_LENGTH)) {
          const out = this.list.shift()
          if (out !== undefined) {
            this.keys.delete(out?.url)
          }
        }
        this.list.push(entry)
        this.keys.add(entry.url)
      }
    }
  }
})
