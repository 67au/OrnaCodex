import localforage from 'localforage'

export const persistedStorage = localforage.createInstance({
  name: 'orna-codex',
  storeName: 'persisted',
})
