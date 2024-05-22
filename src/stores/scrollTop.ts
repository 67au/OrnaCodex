import { defineStore } from 'pinia'

export const useScrollTopState = defineStore('scrollTop', {
  state: () => ({
    home: 0,
    codex: {} as Record<string, Record<string, number>>
  }),
  actions: {
    getCodexTop(category: string, id: string): number {
      return this.codex?.[category]?.[id] ?? 0
    },
    setCodexTop(category: string, id: string, top: number): void {
      if (category in this.codex) {
        this.codex[category][id] = top
      } else {
        this.codex[category] = {}
      }
    }
  }
})
