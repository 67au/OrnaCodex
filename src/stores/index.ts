import { persistedStorage } from '@/storages/persist'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export const persistedStatePlugin = createPersistedStatePlugin({
  storage: {
    getItem: async (key) => {
      return persistedStorage.getItem(key)
    },
    setItem: async (key, value) => {
      return persistedStorage.setItem(key, value)
    },
    removeItem: async (key) => {
      return persistedStorage.removeItem(key)
    },
  },
  persist: false,
})
