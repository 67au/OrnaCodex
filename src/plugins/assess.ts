import type { AssessQuery, AssessResult } from '@/types'

function getDelta(base: number, isBoss: boolean) {
  if (isBoss) {
    return base > 0 ? Math.ceil(base / 8) : Math.ceil(base / -300)
  } else {
    return base > 0 ? Math.ceil(base / 10) : Math.ceil(base / -75)
  }
}

const weaponSkipKeys = new Set(['hp', 'mana', 'defense', 'resistance'])
const commonSkipKeys = new Set(['crit', 'dexterity', 'level', 'quality'])

export function getUpgradedStats(
  base: number,
  quality: number,
  isBoss: boolean,
  key: string | undefined = undefined,
  isWeapon: boolean = false,
  isCelestialWeapon: boolean = false
) {
  const delta = getDelta(base, isBoss)
  const quality_added = (level: number) => quality + (level - 10) / 100
  const levels = isCelestialWeapon ? 20 : 13
  if (key === 'crit') {
    return Array(levels).fill(base)
  }
  if (key === 'dexterity' || (isWeapon && weaponSkipKeys.has(key as string))) {
    return [...Array(levels).keys()].map((level) => {
      if (level == 0) {
        return Math.ceil(base)
      } else {
        return Math.ceil(base + (level + 1) * delta)
      }
    })
  }
  return [...Array(levels).keys()].map((level) => {
    if (level == 0) {
      return Math.ceil(base * quality)
    } else {
      if (level < 10 || isCelestialWeapon) {
        return Math.ceil((base + (level + 1) * delta) * quality)
      } else {
        return Math.ceil((base + (level + 1) * delta) * quality_added(level + 1))
      }
    }
  })
}

export function getUpgradedStat(
  base: number,
  level: number,
  quality: number,
  isBoss: boolean,
  isCelestial: boolean = false
) {
  const delta = getDelta(base, isBoss)
  const quality_added = (level: number) => quality + (level - 10) / 100
  if (level == 1) {
    return Math.ceil(base * quality)
  } else {
    if (level <= 10 || isCelestial) {
      return Math.ceil((base + level * delta) * quality)
    } else {
      return Math.ceil((base + level * delta) * quality_added(level))
    }
  }
}

const APPROXIMATION_MAX_DEEP = 10

function approximate(
  input: number,
  base: number,
  test: number,
  quality: number,
  getStatFunc: Function,
  deep: number = 0,
  direction: number = 0
) {
  const delta = test - input
  if (delta === 0) {
    return quality
  } else {
    const direction_fix = base > 0 !== delta > 0 ? 1 : -1
    const quality_fix = +(quality + 0.01 * direction_fix).toFixed(12)
    const fix = getStatFunc(quality_fix)
    if (direction !== 0 && direction !== direction_fix) {
      return Math.abs(fix - input) - Math.abs(delta) > 0 ? quality : quality_fix
    }
    if (deep < APPROXIMATION_MAX_DEEP) {
      return approximate(input, base, fix, quality_fix, getStatFunc, deep + 1, direction_fix)
    } else {
      return 0
    }
  }
}

export function getItemQuality(input: number, base: number, level: number, isBoss: boolean) {
  const delta = level > 10 ? (level - 10) / 100 : 0
  const base_stat = getUpgradedStat(base, level, 1, isBoss)
  const quality = Math.round(((input / base_stat) * (1 + delta) - delta) * 100) / 100
  const test_stat = getUpgradedStat(base, level, quality, isBoss)
  return approximate(input, base_stat, test_stat, quality, (fix: number) =>
    getUpgradedStat(base, level, fix, isBoss)
  )
}

export function getAdditionalSlots(quality: number) {
  let p
  p = -1
  const qual = Math.round(quality * 100)
  if (qual > 70) {
    p++
  }
  if (qual > 100) {
    p++
  }
  if (qual >= 170) {
    p++
  }
  if (qual > 200) {
    p = -1
  }

  return p
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
  godforged
}

export function getQualityCode(quality: number, isAccessory: boolean = false) {
  let p
  p = -1
  const qual = Math.round(quality * 100)
  if (qual >= 70) {
    p++
  }
  if (qual >= 90) {
    p++
  }
  if (qual >= 100) {
    p++
  }
  if (qual > 100) {
    p++
  }
  if (qual >= 120) {
    p++
  }
  if (qual >= 140) {
    p++
  }
  if (qual >= 170) {
    p++
  }
  if (isAccessory) {
    if (qual > 200) {
      p++
    }
    if (qual > 205) {
      p++
    }
    if (qual > 210) {
      p = -1
    }
  } else {
    if (qual > 200) {
      p = -1
    }
  }
  return p
}

export function getQualityName(quality: number, isAccessory: boolean = false) {
  return Quality[getQualityCode(quality, isAccessory)]
}

export const bonusScale: Record<string, number> = {
  broken: -90,
  poor: 0,
  regular: 0,
  superior: 10,
  famed: 15,
  legendary: 20,
  ornate: 25,
  masterforged: 30,
  demonforged: 40,
  godforged: 50
}

export function getUpgradedBonus(
  base: number,
  qualityCode: Quality,
  isAdornment: boolean = false,
  key: string | undefined = undefined
) {
  let scale
  switch (key) {
    case 'no_follower_bonus':
      scale = 1 / 5
      break
    default:
      scale = 1
  }
  if (qualityCode > -1) {
    if (isAdornment) {
      return base + (base * bonusScale[Quality[qualityCode]]) / 100
    } else {
      return ((100 + base) * (100 + bonusScale[Quality[qualityCode]] * scale) - 10000) / 100
    }
  } else {
    return base
  }
}

export function assess(query: AssessQuery) {
  const result = {
    quality: 1,
    stats: {},
    levels: 13,
    extra: query.extra
  } as AssessResult
  const queryArray = Object.entries(query.data).filter(([m]) => {
    return !(commonSkipKeys.has(m) || (query.extra.isWeapon && weaponSkipKeys.has(m)))
  })
  const assessKey =
    queryArray.length > 0
      ? queryArray.reduce((a, b) => (Math.abs(a[1]) > Math.abs(b[1]) ? a : b))[0]
      : undefined

  if (query.extra.isQuality) {
    result.quality = query.data.quality / 100
  } else {
    if (assessKey === undefined) {
      result.quality = 1
    } else {
      result.quality = getItemQuality(
        query.data[assessKey],
        query.extra.baseStats[assessKey],
        query.data.level,
        query.extra.isBoss
      )
    }
  }

  result.exact = true
  if (!query.extra.isQuality && assessKey !== undefined) {
    const input = getUpgradedStat(
      query.extra.baseStats[assessKey],
      query.data.level,
      result.quality,
      query.extra.isBoss
    )
    result.exact = query.data[assessKey] === input
    if (result.exact && Math.abs(query.data[assessKey]) < 100) {
      const base = getUpgradedStat(
        query.extra.baseStats[assessKey],
        query.data.level,
        1,
        query.extra.isBoss
      )
      const left = +Math.ceil(((input + (input > 0 ? -1 : 0)) / base) * 100).toFixed(12)
      const right = +Math.ceil(((input + (input < 0 ? -1 : 0)) / base) * 100).toFixed(12)
      const left_output = getUpgradedStat(
        query.extra.baseStats[assessKey],
        query.data.level,
        left / 100,
        query.extra.isBoss
      )
      const right_output = getUpgradedStat(
        query.extra.baseStats[assessKey],
        query.data.level,
        right / 100,
        query.extra.isBoss
      )
      result.range = [
        (left < 0 && left_output !== input) || (left > 0 && left_output !== input)
          ? left + 1
          : left,
        (right > 0 && right_output !== input) || (right < 0 && right_output !== input)
          ? right - 1
          : right
      ]
      if (input > 0) {
        result.quality = Math.max(result.quality, +(result.range[1] / 100).toFixed(12))
      } else {
        result.quality = Math.min(result.quality, +(result.range[0] / 100).toFixed(12))
      }
    }
  }

  Object.entries(query.extra.baseStats).forEach(([key, base]) => {
    result.stats[key] = {
      base: base,
      values: getUpgradedStats(
        base,
        result.quality,
        query.extra.isBoss,
        key,
        query.extra.isWeapon,
        query.extra.isCelestialWeapon
      )
    }
  })

  if (query.extra.isCelestialWeapon) {
    result.levels = 20
    result.stats['adornment_slots'] = {
      base: 1,
      values: [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5]
    }
    return result
  }

  if (query.extra.isUpgradable) {
    if (query.extra.isUpgradableSlots) {
      const base = query.extra.baseStats['adornment_slots'] || 0
      result.stats['adornment_slots'] = {
        base: base,
        values: Array(13).fill(base, 0, 10)
      }
      const additionalSlots = getAdditionalSlots(result.quality)
      if (additionalSlots > 0) {
        result.stats['adornment_slots'].values.fill(base + additionalSlots, 0, 10)
      }
      result.stats['adornment_slots'].values.fill(base + 3, 10, 12)
      result.stats['adornment_slots'].values.fill(base + 4, 12, 13)
    } else {
      const base = query.extra.baseStats['adornment_slots']
      if (base !== undefined) {
        result.stats['adornment_slots'] = {
          base: base,
          values: Array(13).fill(base)
        }
      }
    }
  } else {
    result.levels = 1
  }
  return result
}
