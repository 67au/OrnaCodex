import type { CodexEntry } from './codex'
import config from '@/config'

export interface Filter {
  value: Array<string>
  exclude: boolean
}

export type CodexEntryKeys = Exclude<keyof CodexEntry | 'element', ''>

export type Filters = {
  [key in CodexEntryKeys]?: Filter
}

export type PrimarySortKeys = keyof typeof config.primarySort

export type SortValueType = 'NUMBER' | 'SIGNED_NUMBER' | 'PERCENT' | 'SIGNED_PERCENT' | 'BOOL'

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
