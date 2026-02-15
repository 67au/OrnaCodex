import type { Enemy } from '@/types/extra'
import { Dexie, type Table } from 'dexie'

export class ExtraDB extends Dexie {
  enemies!: Table<Enemy>

  constructor() {
    super('extra')
    this.version(1).stores({
      enemies: 'id',
    })
  }
}

export const extraDb = new ExtraDB()
