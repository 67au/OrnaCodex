import { defineStore } from 'pinia'
import type { GuideModel } from '@/types'

export const useGuideState = defineStore('guide', {
  state: () => ({
		cache: {} as Record<string, GuideModel>
  }),
})
