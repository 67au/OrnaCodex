import { global } from '@/plugins/global'
import { defineStore } from 'pinia'

export const useGuideState = defineStore('guide', {
  state: () => ({
    cache: {} as Record<string, Record<string, any>>
  }),
  actions: {
    async searchByCodexName(category: string, name: string) {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)
      try {
        const resp = await fetch(`${global.guideApiUrl}/${category}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({ icontains: [{ name: name }] })
        })
        const result = await resp.json()
        return result
      } catch (error) {
        return []
      }
    }
  }
})
