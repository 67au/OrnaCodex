import config from '@/config'
import { useCodexState } from '@/stores/codex'
import type {
  BestialBond,
  BooleanValue,
  CodexEntryId,
  CodexEntryKey,
  CodexEntryRaw,
  EntrySearchDoc,
  PassiveAbilityRaw,
  StatValue,
  Status,
  StatusKey,
} from '@/types/codex'
import { isUndefined, mapValues, pickBy, isEmptyObject } from 'es-toolkit'
import { fromPairs, isArray } from 'es-toolkit/compat'
import colors from '@/styles/colors.module.scss'
import { mdiMagicStaff, mdiSword } from '@mdi/js'
import { getProperty } from '.'
import { assessKeySet } from './assess'
import { useExtraState } from '@/stores/extra'
import { extraDb } from '@/db/extra'

export function getCodexEntryByKey(key: CodexEntryKey) {
  const codexState = useCodexState()
  return codexState.entries.get(key)
}

export function getCodexEntryById(id: CodexEntryId) {
  const key = id.join('/')
  return getCodexEntryByKey(key)
}

export async function getEnemyStateByKey(key: CodexEntryKey) {
  const row = await extraDb.enemies.get(key)
  if (isUndefined(row)) {
    return undefined
  }
  return row.data
}

const armorPlaceSet = new Set(['head', 'torso', 'legs'])

export class CodexEntry implements CodexEntryRaw {
  constructor(
    public category: string,
    public id: string,
    public tier: number,
    public aura?: string,
    public icon?: string,
    public stats?: Record<string, StatValue>,
    public stats_conditions?: Record<string, Array<string>>,
    public events?: Array<string>,
    public family?: string,
    public rarity?: string,
    public exotic?: BooleanValue,
    public two_handed?: BooleanValue,
    public abilities?: Array<string>,
    public useable_by?: string,
    public item_type?: string,
    public place?: string,
    public type?: string,
    public targets?: string,
    public follower?: string,
    public hp?: number,
    public tags?: Array<string>,
    public spell_type?: string,
    public immunities?: Array<Status>,
    public gives?: Array<Status>,
    public causes?: Array<Status>,
    public cures?: Array<Status>,
    public summons?: Array<Status>,
    public offhand_ability?: CodexEntryKey,
    public skills?: Array<CodexEntryKey>,
    public dropped_by?: Array<CodexEntryKey>,
    public drops?: Array<CodexEntryKey>,
    public upgrade_materials?: Array<CodexEntryKey>,
    public learned_by?: Array<CodexEntryKey>,
    public requirements?: Array<CodexEntryKey>,
    public celestial_classes?: Array<CodexEntryKey>,
    public dismantled_by?: Array<CodexEntryKey>,
    public used_by?: Array<CodexEntryKey>,
    public off_hands?: Array<CodexEntryKey>,
    public skills_level?: Record<string, string>,
    public bestial_bond?: [Array<BestialBond>, Array<BestialBond>, Array<BestialBond>],
  ) {}

  get tierName() {
    return '★' + this.tier
  }

  get name() {
    const codexState = useCodexState()
    return codexState.translations.get(this.key)?.name
  }

  get description() {
    const codexState = useCodexState()
    return codexState.translations.get(this.key)?.description
  }

  get key() {
    return this.category + '/' + this.id
  }

  get url() {
    return `/codex/${this.category}/${this.id}/`
  }

  get iconUrl() {
    return config.ornaStaticUrl + this.icon
  }

  get ornaUrl() {
    return config.ornaUrl + this.url
  }

  get rarityTextClass() {
    return isUndefined(this.rarity)
      ? ''
      : this.rarity + (this.category === 'followers' ? '-followers-text' : '-text')
  }

  get rarityTextColor() {
    return this.rarityTextClass === '' ? 'default' : colors[this.rarityTextClass]
  }

  get auraClass() {
    if (this.category === 'followers') {
      return isUndefined(this.rarity) ? '' : `${this.rarity}-followers`
    }
    if (this.category === 'raids') {
      return 'raids'
    }
    return isUndefined(this.aura) ? '' : this.aura
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
    if (this.spell_type === 'skill') {
      return mdiSword
    }
    if (this.spell_type === 'spell') {
      return mdiMagicStaff
    }
    return undefined
  }

  get offhandAbilityEntry(): CodexEntry | undefined {
    if (isUndefined(this.offhand_ability)) {
      return undefined
    }
    return getCodexEntryByKey(this.offhand_ability)
  }

  get abilitiesArray(): Array<[string, PassiveAbilityRaw]> | undefined {
    if (isUndefined(this.abilities)) {
      return undefined
    } else {
      const codexState = useCodexState()
      return this.abilities
        .filter((ability) => codexState.abilities.has(ability))
        .map((ability) => {
          const abi = codexState.abilities.get(ability) as PassiveAbilityRaw
          const stats = codexState.meta.ability_stats?.[ability]
          if (stats) {
            abi.stats = stats
          }
          return [ability, abi] as [string, PassiveAbilityRaw]
        })
    }
  }

  get statsArray(): Array<[string, StatValue]> {
    return Object.entries(this.stats ?? {})
  }

  get upgradeMaterialsArray() {
    return this.upgrade_materials
      ?.map((key) => getCodexEntryByKey(key))
      .filter((v) => !isUndefined(v))
  }

  get isMaterial() {
    return this.item_type === 'material'
  }

  get isWeapon() {
    return this.item_type === 'weapon'
  }

  get isCelestialWeapon() {
    return this.isWeapon && this.rarity === 'celestial'
  }

  get isTwoHanded() {
    return !isUndefined(this.stats?.two_handed)
  }

  get isAdornment() {
    return this.item_type === 'adornment'
  }

  get isArmor() {
    return armorPlaceSet.has(this.place ?? '')
  }

  get isAccessory() {
    return this.place === 'accessory'
  }

  get isOffHand() {
    return this.place === 'off_hand'
  }

  get isUpgradable() {
    return this.isWeapon || this.isArmor || this.isOffHand
  }

  get hasScalingSlots() {
    return (this.isWeapon || this.isArmor) && this.tier > 2
  }

  get hasSkill() {
    return this.skills !== undefined
  }

  get skillsArray() {
    return this.skills?.map((key) => getCodexEntryByKey(key)).filter((v) => !isUndefined(v))
  }

  get debuffSkills() {
    const debuffMap = new Map<string, Array<{ entry: CodexEntry; chance?: number }>>()
    if (isUndefined(this.skillsArray)) {
      return undefined
    }
    this.skillsArray.forEach((entry) => {
      if (isUndefined(entry.causes)) {
        return
      }

      entry.causes.forEach((status) => {
        const a = debuffMap.get(status.name)
        const arr = a ?? Array<{ entry: CodexEntry; chance?: number }>()
        arr.push({ entry: entry, chance: status.chance })
        debuffMap.set(status.name, arr)
      })
    })

    return debuffMap
  }

  get buffSkills() {
    const buffMap = new Map<string, Array<{ entry: CodexEntry; chance?: number }>>()
    if (isUndefined(this.skillsArray)) {
      return undefined
    }
    this.skillsArray.forEach((entry) => {
      if (isUndefined(entry.gives)) {
        return
      }

      entry.gives.forEach((status) => {
        const a = buffMap.get(status.name)
        const arr = a ?? Array<{ entry: CodexEntry; chance?: number }>()
        arr.push({ entry: entry, chance: status.chance })
        buffMap.set(status.name, arr)
      })
    })

    return buffMap
  }

  get isAssessable() {
    // include upgraded slots
    return this.hasScalingSlots || Object.keys(this.stats ?? {}).some((k) => assessKeySet.has(k))
  }

  get isComparable() {
    return (
      (this.isUpgradable && this.rarity !== 'celestial') || this.isAccessory || this.isAdornment
    )
  }

  get bossScaling() {
    const extraState = useExtraState()
    return extraState.bossScaling.get(this.id) ?? 0
  }

  async getEnemyState() {
    const row = await extraDb.enemies.get(this.key)
    return row ? row.data : undefined
  }

  getStatusArray(name: StatusKey): Array<Status> | undefined {
    return getProperty(this, name)
  }

  getDropEntriesArray(name: string): Array<CodexEntry> | undefined {
    const keys = getProperty(this, name)
    if (keys) {
      return keys
        .map((k: CodexEntryKey) => getCodexEntryByKey(k))
        .filter((v: CodexEntry | undefined) => !isUndefined(v))
    }
    return undefined
  }

  toSearchDoc(): EntrySearchDoc {
    const codexState = useCodexState()
    const doc = pickBy(
      mapValues(codexState.meta.options, (_, k) => {
        const v = getProperty(this, k)
        if (isUndefined(v)) {
          return undefined
        }
        if (isArray(v)) {
          return v.map((val) => {
            return typeof val === 'string' ? val : (val as Status).name
          })
        }
        return v as string | number
      }),
      (v) => !isUndefined(v),
    ) as EntrySearchDoc

    if (this.category === 'items') {
      const eventSet = new Set<string>()
      this.dropped_by?.forEach((key) => {
        const entry = getCodexEntryByKey(key)
        entry?.events?.forEach((event: string) => eventSet.add(event))
      })
      if (eventSet.size > 0) {
        doc['event_drops'] = Array.from(eventSet)
      }
    }

    doc['key'] = this.key
    return doc
  }

  toSortDoc(): EntrySearchDoc | undefined {
    const codexState = useCodexState()
    const sorts = codexState.meta.sorts[this.category]
    if (isUndefined(sorts)) {
      return undefined
    }

    const doc = fromPairs(
      sorts.map((k) => [k, getProperty(this, k)]).filter(([_, v]) => !isUndefined(v)),
    ) as EntrySearchDoc

    if (isEmptyObject(doc)) {
      return undefined
    }

    doc['key'] = this.key
    return doc
  }
}
