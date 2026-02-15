import { useAppStorage } from "@/composables/storage";
import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2";
import { createPinia } from "pinia";
import type { Plugin } from "vue";

const storage = useAppStorage("persisted");

export const piniaPlugin: Plugin = (app) => {
  const pinia = createPinia();
  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          return storage.getItem(key);
        },
        setItem: async (key, value) => {
          return storage.setItem(key, value);
        },
        removeItem: async (key) => {
          return storage.removeItem(key);
        },
      },
      persist: false,
    }),
  );

  app.use(pinia);
};
