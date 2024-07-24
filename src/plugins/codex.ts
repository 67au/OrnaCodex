import { i18n } from '@/i18n'
import { useCodexState } from '@/stores/codex'
import {
  isCelestial,
  isWeapon,
  isAccessory,
  isArmor,
  isAdornment,
  isUpgradable,
  isOffHand,
  isUpgradableSlots,
  isCelestialWeapon,
  valueStrip,
  isMaterial,
  isGears,
  getTierName
} from './utils'
import type { AssessQuery, AssessResult, CodexCategory, Status } from '@/types'
import { assess } from './assess'
import { useExtraState } from '@/stores/extra'

export class CodexEntry {
  category: CodexCategory
  id: string
  constructor(category: CodexCategory, id: string) {
    this.category = category
    this.id = id
  }
  get meta() {
    const codexState = useCodexState()
    return codexState.meta[this.category][this.id]
  }
  get lang() {
    const codexState = useCodexState()
    return codexState.lang[this.category][this.id]
  }
  get url() {
    return CodexEntry.getUrl(this.category, this.id)
  }
  get tier() {
    return getTierName(this.meta.tier)
  }
  get miss() {
    const codexState = useCodexState()
    return codexState.miss[this.category][this.id]
  }
  get materials() {
    return this.meta.source
  }
  get offhandItems() {
    return this.meta.items
  }
  get spells() {
    return this.meta.users
  }
  get abilities() {
    const codexState = useCodexState()
    return codexState.abilities
  }

  get power() {
    const p = this.meta.power
    if (p === undefined) {
      return undefined
    } else {
      const l = []
      l.push(p.pve.value !== undefined ? p.pve.value : p.pve.range.join('-'))
      if (p.pve.multi !== undefined) {
        l.push(`(x${p.pve.multi})`)
      }
      if (p.pvp !== undefined) {
        l.push('|')
        l.push('PvP:')
        l.push(p.pvp.value !== undefined ? p.pvp.value : p.pvp.range.join('-'))
        if (p.pve.multi !== undefined) {
          l.push(`(x${p.pvp.multi})`)
        }
      }
      return l.join(' ')
    }
  }

  // items
  get isAssessable(): boolean {
    const codexState = useCodexState()
    return (
      Object.keys(this.meta.stats).some((key) => codexState.assessKeysSet.has(key)) ||
      isUpgradableSlots(this.meta)
    )
  }
  get isCelestial(): boolean {
    return isCelestial(this.meta)
  }
  get isWeapon(): boolean {
    return isWeapon(this.meta)
  }
  get isAccessory(): boolean {
    return isAccessory(this.meta)
  }
  get isArmor(): boolean {
    return isArmor(this.meta)
  }
  get isAdornment(): boolean {
    return isAdornment(this.meta)
  }
  get isUpgradable(): boolean {
    return isUpgradable(this.meta)
  }
  get isOffHand(): boolean {
    return isOffHand(this.meta)
  }
  get isUpgradableSlots(): boolean {
    return isUpgradableSlots(this.meta)
  }
  get isCelestialWeapon(): boolean {
    return isCelestialWeapon(this.meta)
  }
  get isMaterial(): boolean {
    return isMaterial(this.meta)
  }
  get isGears(): boolean {
    return isGears(this.meta)
  }

  get bossScale() {
    const extraState = useExtraState()
    return extraState.getBossScale(this.id)
  }

  assessQuery(quality: boolean = false): AssessQuery {
    const codexState = useCodexState()

    const query: AssessQuery = {
      data: {
        level: 1
      },
      extra: {
        isBoss: !this.isCelestialWeapon,
        isQuality: quality,
        baseStats: {},
        isGuide: false,
        isWeapon: this.isWeapon,
        isCelestialWeapon: this.isCelestialWeapon,
        isUpgradable: this.isUpgradable,
        isUpgradableSlots: this.isUpgradableSlots
      }
    }
    if (query.extra.isUpgradable) {
      query.extra.isBoss = this.bossScale > -1
    }
    if (query.extra.isQuality) {
      query.data.quality = 100
    }
    for (const [key, value] of Object.entries(this.meta.stats)) {
      if (codexState.assessKeysSet.has(key)) {
        query.data[key] = valueStrip(value as string)
        query.extra.baseStats[key] = query.data[key]
      } else {
        if (key === 'adornment_slots') {
          query.extra.baseStats[key] = Number(value)
        }
      }
    }
    return query
  }

  assess(query: AssessQuery): AssessResult {
    return assess(query)
  }

  static getUrl(category: string, id: string) {
    return `/codex/${category}/${id}/`
  }
}
