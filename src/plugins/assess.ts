import type { AssessQuery, AssessResult, QualityQuery, QualityResult } from '@/types/assess'
import type { CodexEntry } from './codex'
import { fill, isUndefined, mapValues, maxBy, omit, pickBy, range } from 'es-toolkit'
import { getStripedValue } from '.'
import { i18n } from '@/i18n'
import colors from '@/styles/colors.module.scss'
import type { StatValue } from '@/types/codex'

export const assessKeys = [
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

export type assessKey = (typeof assessKeys)[number]

export const assessKeySet = new Set(assessKeys)

export const bossScalingItems = [
  { value: 1, title: 'assess.bossScaling.yes' },
  { value: -1, title: 'assess.bossScaling.no' },
  { value: 0, title: 'assess.bossScaling.unset' },
]

export const bossScalingName = {
  '1': 'assess.bossScaling.name.yes',
  '-1': 'assess.bossScaling.name.no',
  '0': 'assess.bossScaling.name.unset',
}

export const anguishColor = colors['anguish-text']

export function useAssessQuery(entry: CodexEntry, quality: boolean = false) {
  const stats = mapValues(
    pickBy(
      entry.raw.stats!,
      (value: StatValue, key: string) => assessKeySet.has(key as assessKey) && value !== undefined,
    ),
    (value: unknown) => getStripedValue(value as string),
  ) as Record<string, number>

  const query: AssessQuery = {
    query: {
      level: 1,
      angLevel: 0,
      ...stats,
    },
    options: {
      bossScaling: entry.bossScaling,
      isQualityCalc: quality,
      baseStats: stats,
      ///
      // isWeapon: entry.isWeapon,
      isCelestialWeapon: entry.isCelestialWeapon,
      isTwoHanded: entry.isTwoHanded,
      isUpgradable: entry.isUpgradable,
      isOffHand: entry.isOffHand,
    },
  }

  if (entry.isCelestialWeapon) {
    query.options.bossScaling = -1
  }
  if (query.options.isQualityCalc) {
    query.query.quality = 100
  }
  if (entry.raw.stats?.['adornment_slots'] !== undefined) {
    query.options.baseStats['adornment_slots'] = Number(entry.raw.stats.adornment_slots)
  }

  return query
}

// remove at v3.17
// const weaponSkipSet = new Set(['hp', 'mana', 'defense', 'resistance'])
const anguishSkipSet = new Set(['ward', 'foresight'])
const commonSkipSet = new Set(['crit', 'dexterity', 'level', 'quality', 'angLevel'])

function useDelta(base: number, isBossScaling: boolean) {
  const posDiv = isBossScaling ? 8 : 10
  const negDiv = isBossScaling ? -600 : -75
  const divisor = base > 0 ? posDiv : negDiv
  return Math.ceil(base / divisor)
}

function useQualityDelta(level: number) {
  return level > 10 ? (level - 10) / 100 : 0
}

export function getUpgradedStat(
  base: number,
  level: number,
  quality: number,
  isBossScaling: boolean,
  isCelestialWeapon: boolean = false,
  angLevel: number = 0,
) {
  const statDelta = useDelta(base, isBossScaling)
  const qualityDelta = isCelestialWeapon ? 0 : useQualityDelta(level)
  const res = Math.ceil((base + (level === 1 ? 0 : level * statDelta)) * (quality + qualityDelta))
  if (angLevel > 0) {
    return res + Math.floor(0.03 * angLevel * res)
  } else {
    return res
  }
}

export function getUpgradedStatArray(
  base: number,
  quality: number,
  isBossScaling: boolean,
  levels: number,
  key: string | undefined = undefined,
  angLevel: number = 0,
) {
  const statDelta = useDelta(base, isBossScaling)
  const getQualityDelta = (level: number) => (levels > 13 ? 0 : useQualityDelta(level))
  if (key === 'crit') {
    return fill(Array(levels), base)
  }
  if (key === 'dexterity') {
    return range(1, levels + 1).map((level) => {
      return Math.ceil(base + (level === 1 ? 0 : level * statDelta))
    })
  }
  if (!anguishSkipSet.has(key ?? '') && angLevel > 0) {
    return range(1, levels + 1).map((level) =>
      Math.floor(
        Math.ceil(
          (base + (level === 1 ? 0 : level * statDelta)) * (quality + getQualityDelta(level)),
        ) *
          (1 + 0.03 * angLevel),
      ),
    )
  }
  return range(1, levels + 1).map((level) =>
    Math.ceil((base + (level === 1 ? 0 : level * statDelta)) * (quality + getQualityDelta(level))),
  )
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
      const qualityFix = +(quality + 0.01 * directionFix).toFixed(12)
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
  const qualityDelta = useQualityDelta(level)
  const baseStat = getUpgradedStat(base, level, 1, isBossScaling)
  const quality = Math.round(((input / baseStat) * (1 + qualityDelta) - qualityDelta) * 100) / 100
  const simulatedStat = getUpgradedStat(base, level, quality, isBossScaling)
  return approximate(input, baseStat, simulatedStat, quality, (fix: number) => {
    return getUpgradedStat(base, level, fix, isBossScaling)
  })
}

export function getAdditionalSlots(quality: number): number {
  const qual = Math.round(quality * 100)
  if (qual > 200) return -1
  if (qual >= 170) return 2
  if (qual > 100) return 1
  if (qual > 70) return 0
  return -1
}

export enum Quality {
  broken,
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

export const bonusQualityScaling: Record<string, number> = {
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
}

export function getQualityCode(quality: number, level: number, isAccessory: boolean = false) {
  if (level > 10) {
    return level - 4
  }
  const qual = Math.round(quality * 100)
  const maxQual = isAccessory ? 210 : 200
  if (qual > maxQual) {
    return -1
  }

  const BASE_THRESHOLDS = [70, 90, 100, 101, 120, 140, 170] as const
  const ACCESSORY_THRESHOLDS = [201, 206] as const
  const thresholds = isAccessory ? [...BASE_THRESHOLDS, ...ACCESSORY_THRESHOLDS] : BASE_THRESHOLDS
  const code = (thresholds.filter((t) => qual >= t).length - 1) as Quality

  return code
}

export function getQualityColor(code: Quality | undefined) {
  if (code) {
    return colors[Quality[code] + '-text']
  }
  return undefined
}

export function getQualityName(code: Quality | undefined) {
  if (code) {
    return i18n.global.t('assess.quality.' + Quality[code])
  }
  return undefined
}

const bonusScaling: Record<string, number> = {
  no_follower_bonus: 1 / 5,
}

export const qualityBonusSet = new Set([
  'orn_bonus',
  'exp_bonus',
  'luck_bonus',
  'gold_bonus',
  'monster_encounters',
  'no_follower_bonus',
  'manaflask_power',
  'bestial_bond',
  'apex',
])

export const qualityBonusSmallSet = new Set(['bestial_bond'])

export const ratingBonusSet = new Set(['act_first_chance', 'swap_defense_resistance'])
export const ratingBonusSmallSet = new Set([
  'player_r_follower_ability_chance',
  'mana_overspend_chance',
])

export function getQualityBonus(
  base: number,
  quality: number,
  qualityCode: number = -1,
  isAdornment: boolean = false,
  key: string | undefined = undefined,
) {
  const _key = key ?? ''
  if (base === 0) {
    return 0
  }

  if (ratingBonusSet.has(_key)) {
    const r = (base * quality) / 100
    return r < 100 ? r : 100
  }

  if (ratingBonusSmallSet.has(_key)) {
    if (quality > 1) {
      return base + 1
    }
    if (qualityCode === 0) {
      return base / 10
    }
    return base
  }

  if (qualityBonusSet.has(_key)) {
    const keyScaling = bonusScaling[_key] ?? 1
    const qualityScaling = bonusQualityScaling[Quality[qualityCode]!]!

    if (isAdornment || qualityBonusSmallSet.has(_key)) {
      return base + (base * qualityScaling) / 100
    }
    return ((100 + base) * (100 + qualityScaling * keyScaling) - 10000) / 100
  }

  return base
}

export function useAssessResult(query: AssessQuery) {
  if (query.options.bossScaling === 0 && query.options.isUpgradable) {
    return {
      quality: 0,
      angLevel: 0,
      stats: {},
      levels: 0,
    }
  }
  const result: AssessResult = {
    quality: 1,
    angLevel: query.query.angLevel ?? 0,
    stats: {},
    levels: 13,
  }
  const queryMap = pickBy(query.query, (_value: number, key: string) => {
    return !commonSkipSet.has(key)
  })
  const assessKey = maxBy(Object.keys(queryMap), (key) => Math.abs(queryMap[key]!))
  const isBossScaling = query.options.bossScaling > 0

  if (query.options.isQualityCalc) {
    result.quality = query.query.quality! / 100
  } else {
    if (isUndefined(assessKey)) {
      result.quality = 1
    } else {
      result.quality = getItemQuality(
        query.query[assessKey]!,
        query.options.baseStats[assessKey]!,
        query.query.level!,
        isBossScaling,
      )
    }
  }

  if (query.options.isQualityCalc || isUndefined(assessKey)) {
    result.exact = true
  } else {
    const calcStat = (q: number) =>
      getUpgradedStat(query.options.baseStats[assessKey]!, query.query.level!, q, isBossScaling)

    const inputStat = calcStat(result.quality)
    result.exact = inputStat === query.query[assessKey]
    if (result.exact && Math.abs(query.query[assessKey]!) < 100) {
      const baseStat = calcStat(1)
      const [left, right] = [1, -1].map((sign) => {
        const offset = inputStat + (inputStat * sign > 0 ? -1 : 0)
        return +Math.ceil((offset / baseStat) * 100).toFixed(12)
      }) as [number, number]
      const [leftOut, rightOut] = [left, right].map((n) => calcStat((n as number) / 100)) as [
        number,
        number,
      ]
      const normalize = (n: number, out: number) => {
        return (
          n +
          ((inputStat < 0 && out != inputStat) || (inputStat > 0 && out != inputStat)
            ? -Math.sign(n)
            : 0)
        )
      }
      result.range = [normalize(left, leftOut), normalize(right, rightOut)]
      result.quality =
        inputStat > 0
          ? Math.max(result.quality, result.range[1] / 100)
          : Math.min(result.quality, result.range[0] / 100)
    }
  }

  if (query.options.isCelestialWeapon) {
    result.levels = 20
  }
  if (!query.options.isUpgradable) {
    result.levels = 1
  }

  result.stats = mapValues(
    omit(query.options.baseStats, ['adornment_slots']),
    (base: number, key: string) => {
      return {
        base: base,
        values: getUpgradedStatArray(
          base,
          result.quality,
          isBossScaling,
          result.levels,
          key,
          result.angLevel,
        ),
      }
    },
  )

  if (query.options.isCelestialWeapon) {
    result.stats['adornment_slots'] = {
      base: query.options.isTwoHanded ? 2 : 1,
      values: query.options.isTwoHanded
        ? celestialWeaponSlots.map((v: number) => v + 1)
        : celestialWeaponSlots,
    }
    return result
  }

  if (query.options.isUpgradable) {
    const base = query.options.baseStats['adornment_slots'] || 0
    if (query.options.isOffHand) {
      if (base !== 0) {
        result.stats['adornment_slots'] = {
          base: base,
          values: fill(Array(result.levels), base),
        }
      }
    } else {
      const additionalSlots = getAdditionalSlots(result.quality)
      if (result.angLevel > 0) {
        result.stats['adornment_slots'] = {
          base: base,
          values: fill(Array(result.levels), base + 4),
        }
      } else {
        result.stats['adornment_slots'] = {
          base: base,
          values: fill(Array(result.levels), base + additionalSlots, 0, 10),
        }
        fill(result.stats['adornment_slots'].values, base + 3, 10, 12)
        fill(result.stats['adornment_slots'].values, base + 4, 12, 13)
      }
    }
  }

  return result
}

const anguishedBonusSet = new Set(['follower_stats', 'summon_stats'])

export function getDisableQueryFlag(entry: CodexEntry, query: QualityQuery['query']) {
  return query.quality <= 0 || (query.bossScaling === 0 && !entry.isAccessory && !entry.isAdornment)
}

export function useQualityResult(query: QualityQuery) {
  const result: QualityResult = {
    entry: query.entry,
    query: query.query,
    stats: {},
  }

  if (getDisableQueryFlag(query.entry, query.query)) {
    return result
  }

  const baseStat = query.entry.raw?.stats
  if (isUndefined(baseStat)) {
    return result
  }

  const assessQuery = useAssessQuery(query.entry, true)
  assessQuery.query.quality = query.query.quality
  assessQuery.query.angLevel = query.query.angLevel
  assessQuery.options.bossScaling = query.query.bossScaling
  const assessResult = useAssessResult(assessQuery)

  const qualityCode =
    query.query.qualityCode > -1
      ? query.query.qualityCode
      : getQualityCode(query.query.quality / 100, query.query.level, query.entry.isAccessory)

  Object.keys(baseStat).forEach((key: string) => {
    const ar = assessResult.stats[key]
    const stat = baseStat[key] as StatValue
    result.stats[key] = stat

    if (!isUndefined(ar)) {
      result.stats[key] = ar.values[query.query.level - 1] as number
    }
    result.stats[key] = getQualityBonus(
      getStripedValue(result.stats[key] as string),
      query.query.quality,
      qualityCode,
      query.entry.isAdornment,
      key,
    )
    if (query.query.angLevel > 0 && anguishedBonusSet.has(key)) {
      result.stats[key] = getStripedValue(stat as string) + query.query.angLevel * 3
    }
  })

  return result
}
