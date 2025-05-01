import config from '@/config'
import { createFetch } from '@vueuse/core'

export const useExtraFetch = createFetch({
  baseUrl: config.extraApiUrl,
  options: {
    onFetchError(ctx) {
      return ctx
    },
  },
})
