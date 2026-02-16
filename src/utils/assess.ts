import {
  fill,
  inRange,
  isEmptyObject,
  isUndefined,
  mapValues,
  maxBy,
  pickBy,
  range,
} from 'es-toolkit'
import colors from '@/styles/colors.module.scss'
import { type CodexEntry } from './codex'
import type { AssessQuery, AssessResult, FullResult } from '@/types/assess'
import { forEach, get } from 'es-toolkit/compat'

const assessKeys = [
  'hp',
  'mana',
  'attack',
  'magic',
  'defense',
  'resistance',
  'dexterity',
  'ward',
  'crit',
  'foresight',
] as const

const celestialWeaponSlots = [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5]
const commonSkipKeySet = new Set(['crit', 'dexterity', 'level', 'quality', 'angLevel'])
const anguishedBonusKeySet = new Set(['follower_stats', 'summon_stats'])

export const assessKeySet = new Set<string>(assessKeys)
export function pickAssessStats(stats: CodexEntry['stats']): Record<string, number> {
  if (isUndefined(stats)) {
    return {}
  }
  return pickBy(stats, (_, k) => assessKeySet.has(k)) as Record<string, number>
}

function getBaseDelta(base: number, isBossScaling: boolean) {
  const posDiv = isBossScaling ? 8 : 10
  const negDiv = isBossScaling ? -600 : -75
  return Math.ceil(base / (base > 0 ? posDiv : negDiv))
}

function getQualityDelta(level: number, isCelestialWeapon: boolean = false) {
  return level > 10 && !isCelestialWeapon ? level - 10 : 0
}

export function getUpgradedStat(
  base: number,
  level: number,
  quality: number,
  isBossScaling: boolean,
  isCelestialWeapon: boolean = false,
  angLevel: number = 0,
) {
  const baseDelta = getBaseDelta(base, isBossScaling)
  const qualityDelta = getQualityDelta(level, isCelestialWeapon)
  const r = Math.ceil(
    ((base + (level === 1 ? 0 : level * baseDelta)) * (quality + qualityDelta + angLevel * 3)) /
      100,
  )
  return r
}

const anguishedSkipKeySet = new Set(['ward', 'foresight'])

export function getUpgradedStatArray(
  base: number,
  quality: number,
  isBossScaling: boolean,
  levels: 0 | 1 | 13 | 20,
  key?: string | undefined,
  angLevel: number = 0,
) {
  if (levels === 0) {
    return []
  }
  const baseDelta = getBaseDelta(base, isBossScaling)
  const getQualityDetaFunc = (level: number) => getQualityDelta(level, levels > 13)

  if (key === 'crit') {
    return fill(Array(levels), base)
  }

  if (key === 'dexterity') {
    return range(1, levels + 1).map((level: number) => {
      return Math.ceil(base + (level > 1 ? level * baseDelta : 0))
    })
  }

  const angQualityDelta = angLevel > 0 && !anguishedSkipKeySet.has(key ?? '') ? angLevel * 3 : 0

  return range(1, levels + 1).map((level: number) => {
    return Math.ceil(
      ((base + (level > 1 ? level * baseDelta : 0)) *
        (quality + angQualityDelta + getQualityDetaFunc(level))) /
        100,
    )
  })
}

const APPROXIMATION_MAX_DEEP = 10

function approximate(
  input: number,
  base: number,
  initialTest: number,
  initialQuality: number,
  getStatFunc: (fix: number) => number,
) {
  let test = initialTest
  let quality = initialQuality
  let direction = 0

  for (let depth = 0; depth < APPROXIMATION_MAX_DEEP; depth++) {
    const delta = test - input
    if (delta === 0) {
      return quality
    } else {
      const directionFix = base > 0 !== delta > 0 ? 1 : -1
      const qualityFix = quality + directionFix
      const fix = getStatFunc(qualityFix)
      if (direction !== 0 && direction !== directionFix) {
        if (Math.abs(fix - input) - Math.abs(delta) > 0) {
          return quality
        } else {
          return qualityFix
        }
      }
      direction = directionFix
      quality = qualityFix
      test = fix
    }
  }
  return 0
}

export function getItemQuality(input: number, base: number, level: number, isBossScaling: boolean) {
  const qualityDelta = getQualityDelta(level)
  const baseUpgradedStat = getUpgradedStat(base, level, 100, isBossScaling)
  const quality = Math.round((input / baseUpgradedStat) * (100 + qualityDelta) - qualityDelta)
  const testUpgradedStat = getUpgradedStat(base, level, quality, isBossScaling)
  return approximate(input, baseUpgradedStat, testUpgradedStat, quality, (fix: number) => {
    return getUpgradedStat(base, level, fix, isBossScaling)
  })
}

export function getAdditionalSlots(quality: number, level?: number) {
  if (level === 13) return 4
  if (level === 11 || level === 12) return 3
  if (quality >= 170) return 2
  if (quality > 100) return 1
  return 0
}

export enum Quality {
  broken = 0,
  poor,
  regular,
  superior,
  famed,
  legendary,
  ornate,
  masterforged,
  demonforged,
  godforged,
}

export const bonusQualityScaling: Record<keyof typeof Quality, number> = {
  broken: -90,
  poor: 0,
  regular: 0,
  superior: 10,
  famed: 15,
  legendary: 20,
  ornate: 25,
  masterforged: 30,
  demonforged: 40,
  godforged: 50,
} as const

export function getQualityCode(quality: number, level: number) {
  if (level > 10) {
    return level - 4
  }
  // compatible with values > 200
  if (quality > 170) {
    return 6
  }
  if (inRange(quality, 140, 170)) {
    return 5
  }
  if (inRange(quality, 120, 140)) {
    return 4
  }
  if (inRange(quality, 101, 120)) {
    return 3
  }
  if (quality === 100) {
    return 2
  }
  if (inRange(quality, 90, 100)) {
    return 1
  }
  if (inRange(quality, 70, 90)) {
    return 0
  }
  // compatible with values < 70
  return 0
}

export function getQualityColor(code: Quality) {
  const name = Quality[code]
  if (isUndefined(name)) {
    return undefined
  }
  return colors[name + '-text']
}

export function getQualityName(code: Quality) {
  const name = Quality[code]
  return 'quality.' + name
}

const smallBonusScalings: Record<string, number> = {
  no_follower_bonus: 1 / 5,
}

const qualityCodeBonusKeySet = new Set([
  'orn_bonus',
  'exp_bonus',
  'luck_bonus',
  'gold_bonus',
  'monster_encounters',
  'no_follower_bonus',
  'manaflask_power',
  'apex',
  'bestial_bond',
  'player_r_follower_ability_chance',
  'mana_overspend_chance',
])

const noBaseBonusKeySet = new Set([
  'bestial_bond',
  'player_r_follower_ability_chance',
  'mana_overspend_chance',
])

const qualityNumberBonusKeySet = new Set([
  //
  'act_first_chance__pve_',
  'swap_defense_resistance',
])

export function getQualityBonus(
  base: number,
  quality: number,
  qualityCode?: number,
  isAdornment: boolean = false,
  key?: string | undefined,
) {
  if (isUndefined(key) || base === 0) {
    return base
  }

  if (qualityNumberBonusKeySet.has(key)) {
    const r = (base * quality) / 100
    return r < 100 ? r : 100
  }

  if (qualityCodeBonusKeySet.has(key)) {
    const code = Quality[qualityCode ?? -1] as keyof typeof Quality | undefined
    if (isUndefined(code)) {
      return base
    }
    const qualityScaling = bonusQualityScaling[code]

    if (isAdornment || noBaseBonusKeySet.has(key)) {
      return (base * (qualityScaling + 100)) / 100
    }

    const bonusScaling = smallBonusScalings[key] ?? 1

    return ((100 + base) * (100 + qualityScaling * bonusScaling) - 100 * 100) / 100
  }

  return base
}

function getQueryMeta<T extends CodexEntry>(entry: T): AssessQuery['meta'] {
  return {
    baseStats: entry.stats ?? {},
    flags: {
      isAdornment: entry.isAdornment,
      isAccessory: entry.isAccessory,
      // for celestial weapon
      isCelestialWeapon: entry.isCelestialWeapon,
      isTwoHanded: entry.isTwoHanded,
      // levels: 1 | 13
      isUpgradable: entry.isUpgradable,
      // offhand: no +2 slots
      isOffHand: entry.isOffHand,
    },
  }
}

export function setQueryInput<T extends CodexEntry>(entry: T): AssessQuery['input'] {
  return {
    entry: entry,
    level: 1,
    bossScaling: entry.isCelestialWeapon ? -1 : entry.bossScaling,
    quality: 100,
    qualityCode: -1,
    angLevel: 0,
    stats: pickAssessStats(entry.stats),
  }
}

export function getAssessResult(
  input: AssessQuery['input'],
  isQualityCalc: boolean = false,
): AssessResult | undefined {
  const result: AssessResult = {
    entry: input.entry,
    quality: input.quality,
    qualityCode: input.qualityCode,
    bossScaling: input.bossScaling,
    angLevel: isQualityCalc ? input.angLevel : 0,
    stats: {},
    levels: 0,
  }
  const entry = input.entry
  const meta = getQueryMeta(entry)
  if (input.bossScaling === 0 && meta.flags.isUpgradable) {
    return result
  }

  if (isQualityCalc) {
    result.exact = true
  } else {
    const maxKeyValue = maxBy(
      Object.entries(input.stats).filter(([k, _]) => {
        return !commonSkipKeySet.has(k)
      }),
      ([_, v]) => Math.abs(v),
    )
    if (isUndefined(maxKeyValue)) {
      return result
    }
    const [maxKey, maxValue] = maxKeyValue
    const baseStat = get(meta.baseStats, maxKey) as number
    result.quality = getItemQuality(maxValue, baseStat, input.level, input.bossScaling > 0)

    const getUpgradedStatFunc = (quality: number) => {
      return getUpgradedStat(baseStat, input.level, quality, input.bossScaling > 0)
    }

    const currentStat = getUpgradedStatFunc(result.quality)
    result.exact = currentStat === maxValue
    // get range for not exact quality
    if (result.exact && Math.abs(maxValue) < 100) {
      const left = Math.ceil(((currentStat + (currentStat > 0 ? -1 : 0)) / baseStat) * 100)
      const right = Math.ceil(((currentStat + (currentStat > 0 ? 0 : 1)) / baseStat) * 100)
      const leftOut = getUpgradedStatFunc(left)
      const rightOut = getUpgradedStatFunc(right)
      const normalize = (n: number, out: number) => {
        return n + (currentStat !== out ? (Math.sign(n) ? 1 : -1) : 0)
      }
      result.range = [normalize(left, leftOut), normalize(right, rightOut)]

      result.quality =
        currentStat > 0
          ? Math.max(result.quality, result.range[1])
          : Math.min(result.quality, result.range[0])
    }
  }

  result.qualityCode = getQualityCode(result.quality, 1)

  // levels
  result.levels = 13

  if (meta.flags.isCelestialWeapon) {
    result.levels = 20
  }

  if (!meta.flags.isUpgradable) {
    result.levels = 1
  }

  result.stats = mapValues(pickAssessStats(meta.baseStats), (base: number, key: string) => {
    return {
      base: base,
      values: getUpgradedStatArray(
        base,
        result.quality,
        input.bossScaling > 0,
        result.levels,
        key,
        result.angLevel,
      ),
    }
  })

  if (meta.flags.isUpgradable) {
    if (meta.flags.isCelestialWeapon) {
      result.stats['adornment_slots'] = {
        base: meta.flags.isTwoHanded ? 2 : 1,
        values: meta.flags.isTwoHanded
          ? celestialWeaponSlots.map((v: number) => v + 1)
          : celestialWeaponSlots,
      }
      return result
    }

    // adornment slots
    const baseAdornmentSlots = get(meta.baseStats, 'adornment_slots', 0) as number
    if (meta.flags.isOffHand) {
      result.stats['adornment_slots'] = {
        base: baseAdornmentSlots,
        values: fill(Array(result.levels), baseAdornmentSlots),
      }
    } else {
      if (result.angLevel > 0) {
        result.stats['adornment_slots'] = {
          base: baseAdornmentSlots,
          values: fill(Array(result.levels), baseAdornmentSlots + 4),
        }
      } else {
        const additionalSlots = getAdditionalSlots(result.quality)
        result.stats['adornment_slots'] = {
          base: baseAdornmentSlots,
          values: fill(
            Array(result.levels - 3),
            baseAdornmentSlots + additionalSlots,
            0,
            10,
          ).concat([baseAdornmentSlots + 3, baseAdornmentSlots + 3, baseAdornmentSlots + 4]),
        }
      }
    }
  }

  return result
}

export function getFullResult(input: AssessQuery['input']): FullResult {
  const result: FullResult = {
    entry: input.entry,
    quality: input.quality,
    qualityCode: input.qualityCode,
    bossScaling: input.bossScaling,
    angLevel: input.angLevel,
    level: input.level,
    stats: {},
  }
  const entry = input.entry
  const meta = getQueryMeta(entry)

  if (input.bossScaling === 0 && !(meta.flags.isAccessory || meta.flags.isAdornment)) {
    return result
  }

  if (isEmptyObject(meta.baseStats)) {
    return result
  }

  const assessResult = getAssessResult(input, true)

  if (isUndefined(assessResult)) {
    return result
  }

  const qualityCode =
    input.qualityCode > -1 ? input.qualityCode : getQualityCode(input.quality, input.level)

  forEach(meta.baseStats, (v, k) => {
    result.stats[k] = v
    const assessStat = get(assessResult.stats, k)
    if (assessStat) {
      const r = assessStat.values[input.level - 1]
      if (r) {
        result.stats[k] = r
      }
    } else {
      if (typeof v === 'number') {
        result.stats[k] = getQualityBonus(v, input.quality, qualityCode, meta.flags.isAdornment, k)
      }
    }

    if (input.angLevel > 0 && anguishedBonusKeySet.has(k)) {
      result.stats['_' + k] = input.angLevel * 3
    }
  })

  // adornment_slots
  if (meta.flags.isUpgradable) {
    const slots_key = 'adornment_slots'

    if (meta.flags.isCelestialWeapon) {
      result.stats[slots_key] =
        (celestialWeaponSlots[input.level] ?? 0) + (meta.flags.isTwoHanded ? 1 : 0)
    } else {
      const baseAdornmentSlots = get(meta.baseStats, slots_key, 0) as number
      if (meta.flags.isOffHand) {
        if (baseAdornmentSlots > 0) {
          result.stats[slots_key] = baseAdornmentSlots
        }
      } else {
        if (result.angLevel > 0) {
          result.stats[slots_key] = baseAdornmentSlots + 4
        } else {
          const additionalSlots = getAdditionalSlots(result.quality, result.level)
          if (additionalSlots > 0 || baseAdornmentSlots > 0) {
            result.stats[slots_key] = baseAdornmentSlots + additionalSlots
          }
        }
      }
    }
  }

  return result
}
