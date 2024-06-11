import { CodexEntry } from '@/plugins/codex'
import { defineStore } from 'pinia'

const MAX_MAP_SIZE = 30

export const useHistoryState = defineStore('history', {
  state: () => ({
    map: new Map<string, CodexEntry>()
  }),
  getters: {
    history(state): Array<CodexEntry> {
      return [...state.map.values()].reverse()
    },
    string(state): string {
      return JSON.stringify([...state.map.values()])
    }
  },
  actions: {
    initialize(data: Array<CodexEntry>) {
      data.forEach((e) => {
        const entry = new CodexEntry(e.category, e.id)
        if (entry.meta !== undefined) {
          this.add(entry)
        }
      })
    },
    add(entry: CodexEntry) {
      if (this.map.has(entry.url)) {
        this.map.delete(entry.url)
        this.map.set(entry.url, entry)
      } else {
        this.map.set(entry.url, entry)
        if (this.map.size >= MAX_MAP_SIZE) {
          for (const e of this.history.slice(MAX_MAP_SIZE, this.map.size)) {
            this.map.delete(e.url)
          }
        }
      }
    },
    reset() {
      this.$reset()
    }
  }
})
