import config from '@/config'
import { useCodexState } from '@/stores/codex'
import type { Status, StatValue, ValueType } from '@/types/codex'
import { isUndefined, range } from 'es-toolkit'
import { get, isArray } from 'es-toolkit/compat'
import { i18n } from '@/i18n'
import type { BossScaling } from '@/types/extra'
import colors from '@/styles/colors.module.scss'

export function getOptionName(key: string) {
  return i18n.global.t(key.startsWith('stats.') ? key : 'meta.' + key)
}

const statusSet = new Set(['immunities', 'causes', 'cures', 'gives', 'summons', 'status'])
export function getOptionValueName(key: string, name: string | number) {
  if (key === 'tier') {
    return '★' + name
  }
  if (key === 'two_handed' || key === 'exotic') {
    return i18n.global.t('boolean_text.' + name)
  }
  if (statusSet.has(key)) {
    return i18n.global.t('status.' + name)
  }
  if (key.startsWith('stats.')) {
    return i18n.global.t('stats_text.' + name)
  }
  if (key === 'abilities') {
    const codexState = useCodexState()
    return codexState.abilities.get(name as string)!.name
  }
  return i18n.global.t(key + '.' + name)
}

export function getIcon(key: string, name: string | number) {
  if (typeof name === 'number') {
    return undefined
  }
  const codexState = useCodexState()
  if (statusSet.has(key) && codexState.meta.icons[name] !== undefined) {
    return config.ornaStaticUrl + codexState.meta.icons[name]
  }
  if (key === 'abilities') {
    return config.ornaStaticUrl + codexState.meta.icons[name]
  }
  return undefined
}

export function getSortName(key: string) {
  if (key.startsWith('stats.')) {
    return i18n.global.t(key)
  }
  return i18n.global.t('meta.' + key)
}

export function customSort<T extends string>(a: T, b: T, orderMap: Map<T, number>): number {
  const ia = orderMap.has(a) ? orderMap.get(a)! : Infinity
  const ib = orderMap.has(b) ? orderMap.get(b)! : Infinity

  if (ia !== ib) {
    return ia - ib
  }
  return a.localeCompare(b)
}

export function getStatName(key: string) {
  return i18n.global.t(key.startsWith('stats.') ? key : 'stats.' + key)
}

export function getValueType(key: string) {
  const codexState = useCodexState()
  const valueType = get(codexState.meta.value_types, key)
  return valueType
}

export function getStatValueName(key: string, value: StatValue | undefined) {
  // key startswtih 'stats.' | 'abilities.' | 'bonds.'
  const valueType = getValueType(key)

  if (isUndefined(value)) {
    if (isUndefined(valueType)) {
      return 0
    }
    if (valueType.type === 'TEXT' || valueType.type === 'FLAG') {
      return '-'
    }
    return 0
  }

  if (typeof value === 'number') {
    if (isUndefined(valueType)) {
      return value
    }
    let text = value.toString()
    if (valueType.type === 'SIGNED' && value > 0) {
      text = '+' + text
    }
    if (valueType.unit === 'PERCENT') {
      return text + '%'
    }
    if (valueType.unit === 'TURN') {
      return text + ' ' + i18n.global.t(value > 1 ? 'units.turns' : 'units.turn')
    }
    if (valueType.unit === 'MANA') {
      return text + ' ' + i18n.global.t('units.mana')
    }
    if (valueType.unit === 'PER_M') {
      return text + ' ' + i18n.global.t('units.per_m')
    }
    return text
  }

  if (typeof value === 'string') {
    if (key !== 'stats.power') {
      return i18n.global.t('stats_text.' + value)
    }
  }

  if (typeof value === 'boolean') {
    return value ? '★' : '-'
  }

  if (isArray(value)) {
    return value
      .map((s: string | Status) => {
        if (typeof s === 'string') {
          return i18n.global.t('stats_text.' + s)
        } else {
          return i18n.global.t('stats_text.' + s.name)
        }
      })
      .join(', ')
  }

  return value
}

export function getStatConditionName(value: Array<string> | undefined) {
  if (isUndefined(value) || value.length === 0) {
    return ''
  }
  return '(' + value.map((s) => i18n.global.t('stats_conditions.' + s)).join(', ') + ')'
}

export function getProperty<T, K extends keyof T>(obj: T, key: K | string) {
  return get(obj, key, undefined)
}

export function getStatType(key: string): ValueType | undefined {
  const codexState = useCodexState()
  return get(codexState.meta.value_types, key)
}

export function getAttachedAbilityKey(id: string) {
  const codexState = useCodexState()
  return get(codexState.meta.attached_ability, id)
}

export function getBossScalingName(value: BossScaling) {
  return i18n.global.t('bossScaling.name.' + value)
}

export function getElementColor(elem: string) {
  return colors[elem]
}

export const bossScalingItems = computed(() =>
  [1, -1, 0].map((n) => ({
    value: n,
    title: i18n.global.t('bossScaling.select.' + n),
  })),
)

export const levelItems = computed(() =>
  range(13).map((n) => ({
    value: n + 1,
    title: n + 1,
  })),
)

export const qualityCodeItems = computed(() => [
  { title: i18n.global.t('quality.default'), value: -1 },
  { title: i18n.global.t('quality.masterforged'), value: 7 },
  { title: i18n.global.t('quality.demonforged'), value: 8 },
  { title: i18n.global.t('quality.godforged'), value: 9 },
])
