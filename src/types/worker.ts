import type { CodexEntry, CodexTranslationMain } from './codex'
import type { Filters, SortState } from './filters'

export interface CommandMap {
  INIT: Record<string, CodexEntry>
  I18N: Record<string, CodexTranslationMain>
  FILTER: { filters: Filters; search: string }
  SORT: SortState
}

export type CommandType = keyof CommandMap
export type Payload<T extends CommandType> = CommandMap[T]

export type Command<T extends CommandType = CommandType> = {
  type: T
  payload: Payload<T>
}
