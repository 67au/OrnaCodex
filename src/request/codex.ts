import config from '@/config'
import { createFetch } from '@vueuse/core'

export const useCodexFetch = createFetch({
  baseUrl: config.apiUrl,
  options: {
    onFetchError(ctx) {
      return ctx
    },
  },
})
