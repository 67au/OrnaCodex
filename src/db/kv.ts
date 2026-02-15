import { Dexie, type EntityTable } from 'dexie'

export interface KeyValue {
  key: string
  value: unknown
}

export const kvDb = new Dexie('kv') as Dexie & {
  yaco: EntityTable<KeyValue, 'key'>
  extra: EntityTable<KeyValue, 'key'>
  persisted: EntityTable<KeyValue, 'key'>
}

kvDb.version(1).stores({
  yaco: '&key',
  extra: '&key',
  persisted: '&key',
})
