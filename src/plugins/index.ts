import { i18n } from '@/i18n'
import { useCodexState } from '@/stores/codex'
import config from '@/config'
import { head } from 'es-toolkit'

const codexState = useCodexState()

export function getOptionValueName(key: string, name: string): string {
  switch (key) {
    case 'tier':
      return '★' + name
    case 'immunities':
    case 'causes':
    case 'cures':
    case 'gives':
    case 'summons':
      return i18n.global.t('status.' + name)
    case 'abilities':
      return codexState.translation?.abilities?.[name].name as string
    default:
      return i18n.global.t(`${key}.${name}`)
  }
}

export function getOptionName(key: string): string {
  return i18n.global.t('meta.' + key)
}

const statusKeys = new Set(['immunities', 'gives', 'cures', 'causes', 'summons', 'status'])
export function getIcon(key: string, name: string) {
  if (statusKeys.has(key) && codexState.icons[name] !== undefined) {
    return config.ornaStaticUrl + codexState.icons[name]
  }
  if (key === 'abilities' && codexState.translation?.abilities?.[name] !== undefined) {
    return config.ornaStaticUrl + codexState.translation?.abilities[name].icon
  }
  return undefined
}

export function getSortName(name: string) {
  if (name.startsWith('stats')) {
    return i18n.global.t(name)
  }
  return i18n.global.t('meta.' + name)
}

export function customSort<T extends string>(a: T, b: T, orderMap: Map<T, number>): number {
  const ia = orderMap.has(a) ? orderMap.get(a)! : Infinity
  const ib = orderMap.has(b) ? orderMap.get(b)! : Infinity

  if (ia !== ib) {
    return ia - ib
  }
  return a.localeCompare(b)
}

const regex_strip_percent_and_plus = /%|\+/gi

export function getStripedValue(value: string | number) {
  if (typeof value === 'number') {
    return value
  }
  const s = value.replaceAll(regex_strip_percent_and_plus, '')
  return Number(head(s.split(' ')))
}

export function getSignedNumber(n: number) {
  return (n <= 0 ? '' : '+') + n.toString()
}

export function getPercent(n: number) {
  return n.toString() + '%'
}

export function getSignedPercent(n: number) {
  return (n <= 0 ? '' : '+') + n.toString() + '%'
}
