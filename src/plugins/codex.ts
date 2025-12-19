import config from '@/config'
import { useCodexState } from '@/stores/codex'
import { type CodexEntry as CE } from '@/types/codex'
import { isUndefined } from 'es-toolkit'
import colors from '@/styles/colors.module.scss'
import { mdiMagicStaff, mdiSword } from '@mdi/js'
import { assessKeySet, type assessKey } from './assess'
import { useExtraState } from '@/stores/extra'

const codexState = useCodexState()
const extraState = useExtraState()
const armorPlaceSet = new Set(['head', 'torso', 'legs'])

export class CodexEntryFactory {
  private static cache: Map<string, CodexEntry> = new Map()

  static getEntry(category: string, id: string): CodexEntry {
    const key = `${category}/${id}`
    if (!this.cache.has(key)) {
      this.cache.set(key, new CodexEntry(category, id))
    }
    return this.cache.get(key)!
  }

  static getEntryByKey(key: string): CodexEntry {
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }
    const [category, id] = key.split('/') as [string, string]
    return this.getEntry(category, id)
  }
}

export class CodexEntry implements CE {
  category: string
  id: string

  get raw() {
    return codexState.codex?.[this.category]?.[this.id] as CE
  }

  get name() {
    return codexState.translation.main?.[this.category]?.[this.id]?.name as string
  }

  get description() {
    return codexState.translation.main?.[this.category]?.[this.id]?.description as string
  }

  get tierName() {
    return '★' + this.raw.tier
  }

  get url() {
    return `/codex/${this.category}/${this.id}/`
  }

  get cacheKey() {
    return `${this.category}/${this.id}`
  }

  get iconUrl() {
    return config.ornaStaticUrl + this.raw.icon
  }

  get ornaUrl() {
    return config.ornaUrl + this.url
  }

  get element() {
    return this.raw.stats?.element
  }

  get rarityTextClass() {
    return isUndefined(this.raw.rarity)
      ? ''
      : `${this.raw.rarity}${this.category === 'followers' ? '-followers' : ''}-text`
  }

  get rarityTextColor() {
    return this.rarityTextClass === '' ? 'default' : colors[this.rarityTextClass]
  }

  get auraClass() {
    if (this.category === 'followers') {
      return isUndefined(this.raw.rarity) ? '' : `${this.raw.rarity}-followers`
    }
    if (this.category === 'raids') {
      return 'raids'
    }
    return isUndefined(this.raw.aura) ? '' : this.raw.aura
  }

  get iconClass() {
    const _class: Record<string, boolean> = {
      'image-render-pixel': true,
    }
    if (this.auraClass) {
      _class[this.auraClass] = true
    }
    return _class
  }

  get spellTypeIcon() {
    if (this.raw.spell_type === 'skill') {
      return mdiSword
    }
    if (this.raw.spell_type === 'spell') {
      return mdiMagicStaff
    }
    return undefined
  }

  get abilityEntry() {
    const [category, id] = this.raw.ability!
    return CodexEntryFactory.getEntry(category, id)
  }

  get passiveAbilities() {
    if (isUndefined(this.raw.abilities)) {
      return []
    } else {
      return this.raw
        .abilities!.filter(
          (ability) => codexState.translation.abilities?.[ability.name] !== undefined,
        )
        .map((ability) => {
          return codexState.translation.abilities![ability.name]
        })
    }
  }

  get upgradeMaterialsList() {
    return this.raw?.upgrade_materials?.map(([category, id]) =>
      CodexEntryFactory.getEntry(category, id),
    )
  }

  get isExisted() {
    return this.raw !== undefined
  }

  get isMaterial() {
    return this.raw.item_type === 'material'
  }

  get isWeapon() {
    return this.raw.item_type === 'weapon'
  }

  get isCelestialWeapon() {
    return this.isWeapon && this.raw.rarity === 'celestial'
  }

  get isArmor() {
    return armorPlaceSet.has(this.raw.place ?? '')
  }

  get isAccessory() {
    return this.raw.place == 'accessory'
  }

  get isOffHand() {
    return this.raw.place === 'off-hand'
  }

  get isUpgradable() {
    return this.isWeapon || this.isArmor || this.isOffHand
  }

  get isUpgradableSlots() {
    return this.isWeapon || this.isArmor
  }

  get isAssessable() {
    return (
      this.isUpgradable ||
      Object.keys(this.raw.stats ?? {}).some((key) => assessKeySet.has(key as assessKey))
    )
  }

  get isComparable() {
    return this.isUpgradable || this.isAccessory || this.isAdornment
  }

  get isTwoHanded() {
    return this.raw.stats?.['two_handed'] === true
  }

  get isAdornment() {
    return this.raw.item_type === 'adornment'
  }

  get bossScaling() {
    return extraState.bossScaling[this.id] ?? 0
  }

  get enemyStats() {
    return extraState.enemy[this.cacheKey]
  }

  constructor(category: string, id: string) {
    this.category = category
    this.id = id
  }
}
