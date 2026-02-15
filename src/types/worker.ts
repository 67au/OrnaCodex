import type { CodexEntryTranslationRaw, EntrySearchDoc } from './codex'
import type { FiltersState } from './filters'
import type { List, Map, Set } from 'immutable'
import type { SortsState } from './sort'

export interface Actions {
  setup:
    | {
        type: 'i18n'
        data: TranslationsPost
      }
    | {
        type: 'index'
        data: QueryIndexPost
      }
  query: {
    filters: FiltersState
    sorts: SortsState
  }
}

export interface QueryIndexPost {
  keys: Array<string>
  filters: IndexJson
  sorts: Array<[string, EntrySearchDoc]>
}

export type ActionType = keyof Actions
export type Payload<T extends ActionType> = Actions[T]

export interface Message<T extends ActionType> {
  type: T
  payload: Payload<T>
}

export type IndexJson = Record<string, Array<[string | number, Array<string>]>>

export type TranslationsPost = Array<[string, CodexEntryTranslationRaw]>

export type SearchGroup = Map<string | number, Set<string>>

export type ImmutableEntry = Map<string, string | number | List<string>>

export type EntriesKeys = List<string>
