import { defineStore } from 'pinia'

const EXTRA_API_URL = __EXTRA_API_URL__

export const useExtraState = defineStore('extra', {
  state: () => ({
    full: true,
    data: {} as Record<string, any>
  }),
  actions: {
    async fetchAll() {
      await fetch(`${EXTRA_API_URL}/codex/items/meta.json`)
        .then((resp) => resp.json())
        .then((data) => {
          this.data = data
          return true
        })
        .catch(() => {
          return false
        })
    },
    getBossScale(id: string) {
      if (this.data[id] === undefined || this.data[id]['boss'] === undefined) {
        return 0
      } else {
        return this.data[id]['boss']
      }
    }
  }
})
