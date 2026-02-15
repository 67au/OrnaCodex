import config from '@/config'
import type { CodexEntryTranslation, PassiveAbility } from '@/types/codex'
import { CodexEntry } from '@/utils/codex'
import { Dexie, type EntityTable, type Table } from 'dexie'

export class YacoDB extends Dexie {
  entries!: Table<CodexEntry>
  translations!: EntityTable<CodexEntryTranslation>
  abilities!: EntityTable<PassiveAbility>
  msg!: EntityTable<
    {
      language: string
      msg: Record<string, unknown>
    },
    'language'
  >

  constructor() {
    super('yaco')
    this.version(1).stores({
      entries: '[category+id]',
      translations: config.entryTranslationKeys.join(', '),
      abilities: config.abilitiesTranslationKeys.join(', '),
      msg: 'language',
    })

    this.entries.mapToClass(CodexEntry)
  }
}

export const yacoDb = new YacoDB()
