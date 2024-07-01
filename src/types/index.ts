export interface CodexId {
  category: string
  id: string
}

export interface CodexEntry {
  // ToDo
  [key: string]: any
}

export interface CodexMeta {
  base: Record<string, CodexEntry>
  extra: Record<string, CodexEntry>
}

export interface CodexLangs {
  [language: string]: Record<string, CodexEntry>
}

export interface Filter {
  key: string
  value: Array<string> | string | undefined
}

export type Filters = Array<Filter>

export interface FiltersState {
  search: string
  filters: Filters
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

export type Options = Record<string, Set<string | number>>

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
