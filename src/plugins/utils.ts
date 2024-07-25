import router from '@/router'
import { global } from './global'
import { useCodexState } from '@/stores/codex'
import type { CodexCategory, CodexId } from '@/types'
import type { CodexEntry } from './codex'

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

export function numerFixed(num: number) {
  return Number(num.toFixed(12))
}

export function enterCodex(category: string, id: string) {
  router.push({ path: `/codex/${category}/${id}/` })
}

const regex_strip_percent_and_plus = /%|\+/gi
export function valueStrip(value: string) {
  const s = value.replaceAll(regex_strip_percent_and_plus, '')
  return Number(s.split(' ')[0])
}

const auraSet = new Set(['items', 'bosses', 'monsters'])
export function rarityAura(category: CodexCategory, id: string) {
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
export function rarityText(category: CodexCategory, id: string) {
  const aura = rarityAura(category, id)
  if (regex_disable_rarity_text.test(aura)) {
    return ''
  }
  return aura === '' ? '' : `${aura}-text`
}

// for items
export function isCelestial(item: any) {
  return item?.rarity === 'celestial'
}

export function isWeapon(item: any) {
  return item?.item_type === 'weapon'
}

export function isArmor(item: any) {
  return item?.item_type === 'armor'
}

export function isAdornment(item: any) {
  return item?.item_type === 'adornment'
}

export function isOffHand(item: any) {
  return item?.place === 'off-hand'
}

export function isAccessory(item: any) {
  return item?.place === 'accessory'
}

export function isCelestialWeapon(item: any) {
  return isCelestial(item) && isWeapon(item)
}

export function isUpgradableSlots(item: any) {
  return isUpgradable(item) && !isOffHand(item)
}

export function isMaterial(item: any) {
  return item?.item_type === 'material'
}

const gears = new Set(['weapon', 'armor', 'adornment'])
export function isGears(item: any) {
  return item?.item_type !== undefined && gears.has(item?.item_type)
}

export function isUpgradable(item: any) {
  return (isWeapon(item) || isArmor(item)) && !isAccessory(item)
}

export function isTwoHanded(item: any) {
  return item?.stats?.['two_handed'] === true
}

export function getNameTuple(name: string) {
  const l = name.split('.')
  if (Array.isArray(l) && l.length > 1) {
    const v = l.pop()
    const k = l.join('.')
    return [k, v] as [string, string]
  } else {
    return undefined
  }
}

// export function cacheBondBonus() {
//   const cache = {} as Record<string, any>
//   return function (entry: CodexEntry, v: string) {
//     if (cache[v] === undefined) {
//       cache[v] = {}
//     }
//     if (cache[v][entry.url] !== undefined) {
//       return cache[v][entry.url]
//     }
//     const r = Object.values(entry.meta.bestial_bond)
//       .flatMap((n) => n as [string, string, string] | [string, string])
//       .filter((n) => {
//         if (n[0] === 'bonus' && n[1] === v) {
//           return true
//         }
//         return false
//       })
//       .sort((n, m) => valueStrip(n[2] || '0') - valueStrip(m[2] || '0'))
//     if (r.length > 0) {
//       cache[v][entry.url] = r[0]
//     } else {
//       cache[v][entry.url] = false
//     }
//     return cache[v][entry.url]
//   }
// }

// export function cacheBondSkill() {
//   const cache = {} as Record<string, any>
//   return function (entry: CodexEntry, v: string) {
//     if (cache[v] === undefined) {
//       cache[v] = {}
//     }
//     if (cache[v][entry.url] !== undefined) {
//       return cache[v][entry.url]
//     }
//     const r = Object.values(entry.meta.bestial_bond)
//       .flatMap((n) => n as [string, string, string] | [string, string])
//       .filter((n) => {
//         if (n[0] === 'ability' && n[1] === v) {
//           return true
//         }
//         return false
//       })
//     if (r.length > 0) {
//       cache[v][entry.url] = r[0]
//     } else {
//       cache[v][entry.url] = false
//     }
//     return cache[v][entry.url]
//   }
// }
