import localforage from 'localforage'

export const extraStorage = localforage.createInstance({
  name: 'yaco-extra',
  storeName: 'data',
})

export const extraEnemyStorage = localforage.createInstance({
  name: 'yaco-extra',
  storeName: 'enemy',
})
