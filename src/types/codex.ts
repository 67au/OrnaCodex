import type config from '@/config'

export interface CodexMeta {
  version: string
  updated_at: string
  codex: string
  i18n: Record<string, string>
}

export interface CodexTranslation {
  language?: string
  main?: Record<string, Record<string, CodexTranslationMain>>
  abilities?: Record<string, PassiveAbility>
  msg?: Record<string, unknown>
}

export interface CodexTranslationMain {
  name: string
  description?: string
}

export interface PassiveAbility {
  name: string
  icon?: string
  description?: string
}

export type StatusName = keyof typeof config.statusColor

export interface Status {
  name: StatusName
  chance?: string
}

export type BondType = 'BOND' | 'ABILITY' | 'BONUS' | 'BUFF'

export interface BestialBond {
  name: string
  type: BondType
  chance?: string
  value?: string
}

export type CodexEntries = Record<string, Record<string, CodexEntry>>

export type StatValue = string | boolean | Array<string> | number

export interface CodexEntry {
  category: string
  id: string
  ///
  tier?: number
  aura?: string
  icon?: string
  stats?: Record<string, StatValue>
  stats_conditions?: Record<string, Array<string>>
  events?: Array<string>
  family?: string
  rarity?: string
  exotic?: boolean
  abilities?: Array<PassiveAbility>
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
  ///
  ability?: [string, string]
  ///
  skills?: Array<CodexEntry>
  dropped_by?: Array<CodexEntry>
  drops?: Array<CodexEntry>
  upgrade_materials?: Array<CodexEntry>
  learned_by?: Array<CodexEntry>
  requirements?: Array<CodexEntry>
  celestial_classes?: Array<CodexEntry>
  ///
  bestial_bond?: [Array<BestialBond>, Array<BestialBond>, Array<BestialBond>]
}
