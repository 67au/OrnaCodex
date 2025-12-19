import type { CodexEntry } from './codex'
import config from '@/config'

export interface Filter {
  value: Array<string>
  exclude: boolean
}

export type CodexEntryKeys = Exclude<keyof CodexEntry | 'element' | 'two_handed', ''>

export type Filters = {
  [key in CodexEntryKeys]?: Filter
}

export interface FilterOptions {
  eventItems: boolean
}

export type PrimarySortKeys = keyof typeof config.primarySort

export type SortValueType =
  | 'NUMBER'
  | 'SIGNED_NUMBER'
  | 'PERCENT'
  | 'SIGNED_PERCENT'
  | 'SIGNED_TURN'
  | 'SIGNED_TURNS'
  | 'TEXT'
  | 'BOOL'

export interface Sorts {
  [key: string]: {
    [k: string]: SortValueType
  }
}

export interface SortState {
  category: string
  key: string
  asc: boolean
  primary: {
    key: string
    asc: boolean
  }
}
