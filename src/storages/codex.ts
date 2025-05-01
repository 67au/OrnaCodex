import localforage from 'localforage'

export const codexStorage = localforage.createInstance({
  name: 'orna-codex',
  storeName: 'data',
})
