import { kvDb } from '@/db/kv'
import type Dexie from 'dexie'

export function useDbStorage(db: Dexie.Table) {
  return {
    async getItem<T = unknown>(key: string): Promise<T | undefined> {
      const row = await db.get(key)
      return row ? row.value : undefined
    },

    async setItem<T = unknown>(key: string, value: T): Promise<T> {
      await db.put({ key, value })
      return value
    },

    async removeItem(key: string) {
      await db.delete(key)
    },

    async clear() {
      await db.clear()
    },

    // extra
    async setItems<T = unknown>(items: Array<{ key: string; value: T }>) {
      await db.bulkPut(items)
      return items
    },

    async getItems<T = unknown>(keys: Array<string>): Promise<Array<T | undefined>> {
      const rows = await db.bulkGet(keys)
      return rows.map((row) => (row ? row.value : undefined))
    },

    async keys(): Promise<Array<string>> {
      const keys: Array<string> = await db.toCollection().primaryKeys()
      return keys
    },
  }
}

export function useAppStorage(name: string) {
  const kv = kvDb.table(name)

  return useDbStorage(kv)
}
