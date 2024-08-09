import type { OptionType } from '@/enums'

export interface CodexId {
  category: CodexCategory
  id: string
}

export interface CodexEntry {
  // ToDo
  [key: string]: any
}

export type CodexCategory = keyof CodexMeta['meta']

export interface CodexMeta {
  meta: {
    bosses: CodexEntry
    classes: CodexEntry
    followers: CodexEntry
    items: CodexEntry
    monsters: CodexEntry
    raids: CodexEntry
    spells: CodexEntry
  }
  extra: {
    icons: Record<string, string>
  }
}

export interface CodexLangs {
  [language: string]: Record<string, CodexEntry>
}

export interface OptionsKeys {
  single: Array<string>
  array: Array<string>
  status: Array<string>
}

export interface Filter {
  value: Array<string> | string | undefined
  type: OptionType
}

export type Filters = Map<string, Filter>

export interface FiltersStorage {
  search: string
  filters: Array<[string, Filter]>
  multiple: boolean
  version: string | undefined
}

export interface SortState {
  default: {
    name: string
    asc: boolean
  }
  name: string | undefined
  asc: boolean
  version: string | undefined
}

export type Options = Record<string, Set<string | number | boolean>>

export interface Status {
  name: string
  icon: string
  chance?: string
}

export interface Stat {
  base: number
  values: Array<number>
}

export type Stats = Record<string, Stat>

export interface BestialBond {
  [key: string]: Array<[string, string] | [string, string, string]>
}

export interface AssessQuery {
  data: Record<string, number>
  extra: {
    isBoss: boolean
    isQuality: boolean
    baseStats: Record<string, number>
    isGuide?: boolean
    isWeapon?: boolean
    isCelestialWeapon?: boolean
    isUpgradable?: boolean
    isUpgradableSlots?: boolean
    isTwoHanded?: boolean
  }
}

export interface AssessResult {
  quality: number
  stats: Stats
  levels?: number
  exact?: boolean
  range?: [number, number]
  extra?: AssessQuery['extra']
}

export interface GuideData {
  statusImmunities?: Array<string>
  elements?: {
    resistance?: Array<string>
    weak?: Array<string>
    immunity?: Array<string>
  }
  spawns?: Array<string>
  element?: string
  category?: string
  level?: string
  cost?: number
  tier?: number
}

export interface ComparedEntry {
  entry: CodexEntry
  query: {
    quality: string
    level: number
    isBoss: boolean
    qualityCode: number
  }
}
