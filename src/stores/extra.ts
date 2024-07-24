import { defineStore } from 'pinia'
import { fetchExtra } from '@/plugins/extra'

export const useExtraState = defineStore('extra', {
  state: () => ({
    full: true,
    data: {} as Record<string, any>
  }),
  actions: {
    async fetchAll() {
      const data = await fetchExtra()
      if (data !== undefined) {
        this.$patch({
          data: data
        })
        return true
      } else {
        return false
      }
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
