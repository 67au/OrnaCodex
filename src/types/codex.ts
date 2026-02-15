import type { CodexEntry } from '@/utils/codex'
import type { Locale } from '@/i18n'

export interface CodexManifest {
  version: string
  last_updated: string
  files: {
    codex: string
    locales: Record<string, string>
  }
}

export interface CodexData {
  entries: Array<CodexEntryRaw>
  meta: {
    icons: Record<string, string>
    options: Record<string, Array<string>>
    sorts: Record<string, Array<string>>
    ability_stats: Record<string, AbilityStats>
    attached_ability: Record<string, string>
    value_types: Record<string, ValueType>
  }
}

export interface ValueType {
  type?: 'FLAG' | 'TEXT' | 'SIGNED'
  unit?: 'PERCENT' | 'TURN' | 'MANA' | 'PER_M'
}

export type AbilityBuffKey = 'causes' | 'gives'

export type AbilityStats = Record<AbilityBuffKey, Array<Status>> &
  Record<Exclude<string, AbilityBuffKey>, StatValue>

export interface CodexEntryTranslationRaw {
  name: string
  description?: string
}

export interface CodexEntryTranslation extends CodexEntryTranslationRaw {
  category: string
  id: string
  language: string
}

export interface CodexDataTranslation {
  entries: Array<CodexEntryTranslation>
  abilities: Array<PassiveAbility>
  msg: Record<string, Record<string, string>>
}

export interface PassiveAbilityRaw {
  name: string
  description?: string
  stats?: AbilityStats
}

export interface PassiveAbility extends PassiveAbilityRaw {
  id: string
  language: string
}

export type BondType = 'BOND' | 'ABILITY' | 'BONUS'

export type BestialBond =
  | {
      name: string
      type: 'BOND'
      value: number
    }
  | {
      name: string
      type: 'BONUS'
      value: StatValue
    }
  | {
      name: string
      type: 'ABILITY'
    }

export interface Status {
  name: string
  chance?: number
}

export interface PendingUpdate {
  manifest: CodexManifest
  codex: CodexData
  locales: Array<{
    locale: Locale
    data: CodexDataTranslation
  }>
}

export type StatusKey = 'immunities' | 'gives' | 'causes' | 'cures' | 'summons'

export type StatValue = string | number | boolean | Array<string> | Array<Status>

export type BooleanValue = 1 | 0

export type CodexEntryId = [string, string]

export type CodexEntryKey = string

export interface CodexEntryRaw {
  category: string
  id: string
  tier?: number
  ///
  aura?: string
  icon?: string
  stats?: Record<string, StatValue>
  stats_conditions?: Record<string, Array<string>>
  events?: Array<string>
  family?: string
  rarity?: string
  exotic?: BooleanValue
  two_handed?: BooleanValue
  abilities?: Array<string>
  useable_by?: string
  item_type?: string
  place?: string
  type?: string
  targets?: string
  follower?: string
  hp?: number
  tags?: Array<string>
  spell_type?: string
  immunities?: Array<Status>
  gives?: Array<Status>
  causes?: Array<Status>
  cures?: Array<Status>
  summons?: Array<Status>
  skills_level?: Record<string, string>
  ///
  offhand_ability?: CodexEntryKey
  /// drops
  skills?: Array<CodexEntryKey>
  dropped_by?: Array<CodexEntryKey>
  drops?: Array<CodexEntryKey>
  upgrade_materials?: Array<CodexEntryKey>
  learned_by?: Array<CodexEntryKey>
  requirements?: Array<CodexEntryKey>
  celestial_classes?: Array<CodexEntryKey>
  /// added drops
  dismantled_by?: Array<CodexEntryKey>
  used_by?: Array<CodexEntryKey>
  off_hands?: Array<CodexEntryKey>
  materials?: Array<CodexEntryKey>
  ///
  bestial_bond?: [Array<BestialBond>, Array<BestialBond>, Array<BestialBond>]
}

export type EntrySearchDoc = Record<'key', string> & Record<Exclude<string, 'key'>, StatValue>

export type GetEntryFunc<T extends CodexEntry> = (key: string) => T
