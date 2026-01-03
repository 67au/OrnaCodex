import type { CodexEntryRaw, CodexTranslationMain } from './codex'
import type { FilterOptions, Filters, SortState } from './filters'

export interface CommandMap {
  INIT: Record<string, CodexEntryRaw>
  I18N: Record<string, CodexTranslationMain>
  FILTER: { filters: Filters; options: FilterOptions; search: string }
  SORT: SortState
}

export type CommandType = keyof CommandMap
export type Payload<T extends CommandType> = CommandMap[T]

export type Command<T extends CommandType = CommandType> = {
  type: T
  payload: Payload<T>
}
