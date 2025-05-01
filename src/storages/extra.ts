import localforage from 'localforage'

export const extraStorage = localforage.createInstance({
  name: 'yaco-extra',
  storeName: 'data',
})

export const extraCacheStorage = localforage.createInstance({
  name: 'yaco-extra',
  storeName: 'cache',
})
