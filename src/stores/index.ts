import { type Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  const installPersistedStatePlugin = createPersistedStatePlugin({
    persist: false,
    storage: {
      getItem: async (key) => {
        return localforage.getItem(key)
      },
      setItem: async (key, value) => {
        return localforage.setItem(key, value)
      },
      removeItem: async (key) => {
        return localforage.removeItem(key)
      },
    },
  })
  pinia.use((context) => installPersistedStatePlugin(context))

  app.use(pinia)
}
