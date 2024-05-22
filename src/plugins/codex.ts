import { i18n } from '@/i18n'
import { useCodexState } from '@/stores'
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
  valueStrip
} from './utils'
import type { AssessQuery, AssessResult } from '@/types'
import { assess } from './assess'
import { useExtraState } from '@/stores/extra'

export class CodexEntry {
  category: string
  id: string
  constructor(category: string, id: string) {
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
  get miss() {
    const codexState = useCodexState()
    // https://github.com/67au/OrnaCodexCrawler/blob/a1782bf2c13dbedb1eb2bb3a0a639357e8127dbc/crawler/cmd/codex.py#L183
    return codexState.missEntries[`${i18n.global.locale.value}/${this.category}/${this.id}`]
  }
  get materials() {
    const codexState = useCodexState()
    return codexState.materials?.[this.id]
  }
  get spells() {
    const codexState = useCodexState()
    return codexState.spells?.[this.id]
  }
  get offhandItems() {
    const codexState = useCodexState()
    return codexState.offhandSkills?.[this.id]
  }

  // items
  get isAssessable(): boolean {
    const codexState = useCodexState()
    return Object.keys(this.meta.stats).some((key) => codexState.sortKeys.has(key))
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
    // wait for fix
    // return this.isWeapon || (this.isArmor && !this.isAccessory);
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
