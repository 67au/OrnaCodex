import { isAccessory } from "./item_utils";

function getDelta(base: number, isBoss: boolean) {
  if (isBoss) {
    return base > 0 ? Math.ceil(base / 8) : Math.ceil(base / -300);
  } else {
    return base > 0 ? Math.ceil(base / 10) : Math.ceil(base / -75);
  }
}

const weaponSkipKeys = new Set(['hp', 'mana', 'defense', 'resistance']);
const commonSkipKeys = new Set(['crit', 'dexterity']);

export function getUpgradedStats(base: number, quality: number, isBoss: boolean, key: string | undefined = undefined, isWeapon: boolean = false, isCelestial: boolean = false) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level: number) => quality + (level - 10) / 100;
  const levels = isCelestial ? 20 : 13;
  if (key === 'crit') {
    return Array(levels).fill(base);
  }
  if (key === 'dexterity' || (isWeapon && weaponSkipKeys.has(key as string))) {
    return [...Array(levels).keys()].map((level) => {
      if (level == 0) {
        return Math.ceil(base);
      } else {
        return Math.ceil((base + (level + 1) * delta));
      }
    })
  }
  return [...Array(levels).keys()].map((level) => {
    if (level == 0) {
      return Math.ceil(base * quality);
    } else {
      if (level < 10 || isCelestial) {
        return Math.ceil((base + (level + 1) * delta) * quality);
      } else {
        return Math.ceil((base + (level + 1) * delta) * quality_plus(level + 1));
      }
    }
  })
}

export function getUpgradedStat(base: number, level: number, quality: number, isBoss: boolean, isCelestial: boolean = false) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level: number) => quality + (level - 10) / 100;
  if (level == 1) {
    return Math.ceil(base * quality);
  } else {
    if (level <= 10 || isCelestial) {
      return Math.ceil((base + level * delta) * quality);
    } else {
      return Math.ceil((base + level * delta) * quality_plus(level));
    }
  }
}


export function getItemQuailty(input: number, base: number, level: number, isBoss: boolean) {
  const delta = level > 10 ? (level - 10) / 100 : 0;
  const base_stat = getUpgradedStat(base, level, 1, isBoss);
  const quality = Math.round(((input / base_stat) * (1 + delta) - delta) * 100) / 100;
  const test_stat = getUpgradedStat(base, level, quality, isBoss);
  const stat_delta = test_stat - input;
  if (stat_delta === 0) {
    return quality;
  } else {
    const quality_fix = quality + 0.01 * ((base_stat > 0) !== (stat_delta > 0) ? 1 : -1);
    const fix_stat = getUpgradedStat(base, level, quality_fix, isBoss);
    const fix_delta = fix_stat - input;
    if (fix_delta === 0) {
      return quality_fix
    } else {
      return quality_fix + 0.01 * ((base_stat > 0) !== (fix_delta > 0) ? 1 : -1)
    }
  }

}

export interface Stat {
  base: number,
  values: Array<number>,
}

export interface Stats {
  [key: string]: Stat,
}

export interface AssessQueryData {
  [key: string]: number,
}

export interface AssessQueryExtra {
  isBoss: boolean,
  isQuality: boolean,
  baseStats: AssessQueryData,
  fromGuide?: boolean,
  isWeapon?: boolean,
  isCelestial?: boolean,
  isUpgradableSlots?: boolean,
  isUpgradable?: boolean,
}

export interface AssessQuery {
  data: AssessQueryData,
  extra: AssessQueryExtra,
}

export interface AssessResult {
  quality: number,
  stats: Stats,
  levels?: number,
  extra?: AssessQueryExtra,
}

export function getAdditionalSlots(quality: number) {
  var p;
  p = -1;
  const qual = Math.round(quality * 100);
  if (qual > 70) { p++ };
  if (qual > 100) { p++ };
  if (qual >= 170) { p++ };
  if (qual > 200) { p = -1 };

  return p;
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

export function getQualityCode(quality: number, isAccessory: boolean = false) {
  var p;
  p = -1;
  const qual = Math.round(quality * 100);
  if (qual >= 70) { p++ };
  if (qual >= 90) { p++ };
  if (qual >= 100) { p++ }
  if (qual > 100) { p++ };
  if (qual >= 120) { p++ };
  if (qual >= 140) { p++ };
  if (qual >= 170) { p++ };
  if (isAccessory) {
    if (qual >= 200) { p++ };
    if (qual > 205) { p++ };
    if (qual > 210) { p = -1 };
  } else {
    if (qual > 200) { p = -1; }
  }

  return p;
}

export function getQualityName(quality: number, isAccessory: boolean = false) {
  return Quality[getQualityCode(quality)]
}

export const bonusScale: Record<string, number> = {
  broken: 10,
  poor: 100,
  regular: 100,
  superior: 110,
  famed: 115,
  legendary: 120,
  ornate: 125,
  masterforged: 130,
  demonforged: 140,
  godforged: 150,
}

export function getUpgradedBonus(base: number, quality_code: Quality) {
  if (quality_code > 0) {
    return (((100 + base) * (bonusScale[Quality[quality_code]])) - 10000) / 100
  } else {
    return base
  }
}

export function assess(query: AssessQuery) {
  const result = {
    quality: 1,
    stats: {},
    levels: 13,
    extra: query.extra,
  } as AssessResult;
  const queryArray = (Object.entries(query.data).filter(([m, _]) => {
    return !(commonSkipKeys.has(m) || (query.extra.isWeapon && weaponSkipKeys.has(m)))
  })).toSorted(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  )
  if (query.extra.isQuality) {
    result.quality = query.data.quality / 100;
  } else {
    result.quality = 2;
    if (queryArray.length > 0) {
      const key = queryArray[0][0];
      result.quality = getItemQuailty(query.data[key], query.extra.baseStats[key], query.data.level, query.extra.isBoss);
    }
  }
  (Object.entries(query.extra.baseStats)).forEach(([key, base]) => {
    result.stats[key] = {
      base: base,
      values: getUpgradedStats(base, result.quality, query.extra.isBoss,
        key, query.extra.isWeapon, query.extra.isCelestial)
    }
  })

  if (query.extra.isWeapon && query.extra.isCelestial) {
    result.levels = 20;
    result.stats['adornment_slots'] = {
      base: 1,
      values: [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5],
    }
    return result;
  }

  if (query.extra.isUpgradable) {
    if (query.extra.isUpgradableSlots) {
      const base = query.extra.baseStats['adornment_slots'] || 0;
      result.stats['adornment_slots'] = {
        base: base,
        values: Array(13).fill(base, 0, 10),
      }
      const additionalSlots = getAdditionalSlots(result.quality);
      if (additionalSlots > 0) {
        result.stats['adornment_slots'].values.fill(base + additionalSlots, 0, 10);
      }
      result.stats['adornment_slots'].values.fill(base + 3, 10, 12);
      result.stats['adornment_slots'].values.fill(base + 4, 12, 13);
    } else {
      const base = query.extra.baseStats['adornment_slots'];
      if (base !== undefined) {
        result.stats['adornment_slots'] = {
          base: base,
          values: Array(13).fill(base),
        }
      }
    }
  } else {
    result.levels = 1;
  }
  return result;
}