import type { CodexEntry } from './codex'
import { get, isArray } from 'es-toolkit/compat'
import { useCodexState } from '@/stores/codex'
import { i18n } from '@/i18n'
import type { StatValue } from '@/types/codex'
import { isUndefined } from 'es-toolkit'
import { getStripedValue } from '.'

export function getStatType(category: string, key: string): string | undefined {
  const codexState = useCodexState()
  return codexState.sorts?.[category]?.[key]
}

export function getStatString(entry: CodexEntry, key: string) {
  const raw = get(entry.raw, 'stats.' + key)
  const type = getStatType(entry.category, 'stats.' + key)
  if (type === undefined) {
    return raw
  }
  if (type.endsWith('TURN')) {
    return `${raw} ${i18n.global.t('units.turn')}`
  }
  if (type.endsWith('TURNS')) {
    return `${raw} ${i18n.global.t('units.turns')}`
  }
  if (type.endsWith('MANA')) {
    return `${raw} ${i18n.global.t('units.mana')}`
  }
  if (type.endsWith('PERCENT')) {
    return `${raw}%`
  }
  if (type === 'TEXT') {
    return i18n.global.t('stats_text.' + raw)
  }
  return raw
}

export function getStatValueString(entry: CodexEntry, key: string, raw: StatValue) {
  const type = getStatType(entry.category, 'stats.' + key)
  if (type === undefined) {
    if (isArray(raw)) {
      if (key === 'element') {
        return raw.map((elem: string) => i18n.global.t('element.' + elem)).join(', ')
      }
      return raw.map((s: string) => i18n.global.t('stats_text.' + s)).join(', ')
    }
    if (isUndefined(raw)) {
      return '-'
    }
    return raw
  }
  if (type === 'TEXT') {
    if (isUndefined(raw)) {
      return '-'
    }
    return i18n.global.t('stats_text.' + raw)
  }
  if (type === 'BOOL' || typeof raw === 'boolean') {
    return raw ? '★' : '-'
  }

  const value = getStripedValue(raw as string | number)
  const out = (type.startsWith('SIGNED') && value > 0 ? '+' : '') + value
  if (type.endsWith('TURN')) {
    return `${out} ${i18n.global.t('units.turn')}`
  }
  if (type.endsWith('TURNS')) {
    return `${out} ${i18n.global.t('units.turns')}`
  }
  if (type.endsWith('MANA')) {
    return `${out} ${i18n.global.t('units.mana')}`
  }
  if (type.endsWith('PERCENT')) {
    return `${out}%`
  }
  return out
}
