import router from '@/router'
import { global } from './global'
import { useCodexState } from '@/stores'
import type { CodexId } from '@/types'

const regex_temp = / \[temp\]/gi
const regex_underline = / |\.|:|\\|\/|'/gi
const regex_up = /↑/gi
const regex_down = /↓/gi
export function convertStatusKey(key: string) {
  return key
    .toLowerCase()
    .replaceAll(regex_temp, '')
    .replaceAll(regex_underline, '_')
    .replaceAll(regex_up, 'u')
    .replaceAll(regex_down, 'd')
}

export function getTierName(tier: number) {
  return `${global.star}${tier}`
}

export function getStaticUrl(url: string) {
  return `${global.staticUrl}${url}`
}

export function parseCodexUrl(url: string) {
  const a = url.split('/')
  return {
    category: a[2],
    id: a[5]
  } as CodexId
}

export function enterCodex(category: string, id: string) {
  router.push({ path: `/codex/${category}/${id}/` })
}

const regex_strip_percent_and_plus = /%|\+/gi
export function valueStrip(value: string) {
  return Number(value.replaceAll(regex_strip_percent_and_plus, ''))
}

const auraSet = new Set(['items', 'bosses', 'monsters'])
export function rarityAura(category: string, id: string) {
  const codexState = useCodexState()
  const entry = codexState.meta[category][id]
  if (auraSet.has(category)) {
    return entry['aura']
  }
  if (category === 'followers') {
    return global.rarityAura[entry['rarity']]
  }
  return ''
}

const regex_disable_rarity_text = /arisen|superboss/gi
export function rarityText(category: string, id: string) {
  const aura = rarityAura(category, id)
  if (regex_disable_rarity_text.test(aura)) {
    return ''
  }
  return aura === '' ? '' : `${aura}-text`
}

// for items
export function isCelestial(item: any) {
  return item['rarity'] === 'celestial'
}

export function isWeapon(item: any) {
  return item['item_type'] === 'weapon'
}

export function isArmor(item: any) {
  return item['item_type'] === 'armor'
}

export function isAdornment(item: any) {
  return item['item_type'] === 'adornment'
}

export function isOffHand(item: any) {
  return item['place'] === 'off-hand'
}

export function isAccessory(item: any) {
  return item['place'] === 'accessory'
}

export function isCelestialWeapon(item: any) {
  return isCelestial(item) && isWeapon(item)
}

export function isUpgradableSlots(item: any) {
  return isUpgradable(item) && !isOffHand(item)
}

export function isMaterial(item: any) {
  return item['item_type'] === 'material'
}

const gears = new Set(['weapon', 'armor', 'adornment'])
export function isGears(item: any) {
  return item['item_type'] !== undefined && gears.has(item['item_type'])
}

export function isUpgradable(item: any) {
  return (isWeapon(item) || isArmor(item)) && !isAccessory(item)
}
