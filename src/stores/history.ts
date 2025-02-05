import { CodexEntry } from '@/plugins/codex'
import { parseCodexUrl } from '@/plugins/utils'
import { defineStore } from 'pinia'

const MAX_MAP_SIZE = 30

export const useHistoryState = defineStore('history', {
  state: () => ({
    hmap: new Map<string, CodexEntry>()
  }),
  getters: {
    history(state): Array<CodexEntry> {
      return [...this.hmap.values()].reverse()
    }
  },
  actions: {
    add(entry: CodexEntry) {
      if (this.hmap.has(entry.url)) {
        this.hmap.delete(entry.url)
      } else {
        if (this.hmap.size >= MAX_MAP_SIZE) {
          for (const e of this.history.slice(MAX_MAP_SIZE, this.hmap.size)) {
            this.hmap.delete(e.url)
          }
        }
      }
      this.hmap.set(entry.url, entry)
    },
    reset() {
      this.$reset()
    }
  },
  persistedState: {
    persist: true,
    deserialize: (value: Array<string>) => {
      return {
        hmap: new Map(
          value
            .map((url) => {
              const e = parseCodexUrl(url)
              return new CodexEntry(e.category, e.id)
            })
            .filter((e) => {
              return e.meta !== undefined
            })
            .map((e) => [e.url, e])
        )
      }
    },
    serialize: (value) => {
      return [...value.hmap.keys()]
    }
  }
})
