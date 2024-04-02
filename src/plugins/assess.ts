function getDelta(base: number, isBoss: boolean) {
  if (isBoss) {
    return base > 0 ? Math.ceil(base / 8) : Math.ceil(base / -300);
  } else {
    return base > 0 ? Math.ceil(base / 10) : Math.ceil(base / -75);
  }
}

const weaponSkipKeys = ['hp', 'mana', 'defense', 'resistance'];
const commonSkipKeys = ['crit', 'dexterity'];

export function getUpgradedStats(base: number, quality: number, isBoss: boolean, key: string | undefined = undefined, isWeapon: boolean = false) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level: number) => quality + (level - 10) / 100;
  if (key === 'crit') {
    return Array(13).fill(base);
  }
  if (key === 'dexterity' || (isWeapon && weaponSkipKeys.includes(key as string))) {
    return [...Array(13).keys()].map((level) => {
      if (level == 0) {
        return Math.ceil(base);
      } else {
        return Math.ceil((base + (level + 1) * delta));
      }
    })
  }
  return [...Array(13).keys()].map((level) => {
    if (level == 0) {
      return Math.ceil(base * quality);
    } else {
      if (level < 10) {
        return Math.ceil((base + (level + 1) * delta) * quality);
      } else {
        return Math.ceil((base + (level + 1) * delta) * quality_plus(level + 1));
      }
    }
  })
}

export function getUpgradedStat(base: number, level: number, quality: number, isBoss: boolean) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level: number) => quality + (level - 10) / 100;
  if (level == 1) {
    return Math.ceil(base * quality);
  } else {
    if (level <= 10) {
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
  }
  if (stat_delta > 0) {
    return base_stat > 0 ? quality - 0.01 : quality + 0.01;
  } else {
    return base_stat > 0 ? quality + 0.01 : quality - 0.01;
  }
}

export interface AssessQuery {
  data: {
    [key: string]: number,
  },
  extra: {
    isQuality: boolean,
    isBoss: boolean,
    fromGuide: boolean,
    baseStats: any,
  }
}

export function assess(query: AssessQuery, isWeapon: boolean) {
  let skipKeys: Set<string>;
  const result = {
    quality: 1,
    stats: query.extra.baseStats,
  };
  if (isWeapon) {
    skipKeys = new Set(commonSkipKeys.concat(weaponSkipKeys));
  } else {
    skipKeys = new Set(commonSkipKeys);
  }
  const queryArray = (Object.entries(query.data).filter((m) => !skipKeys.has(m[0]))).toSorted(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  )
  if (query.extra.isQuality) {
    result.quality = query.data.quality / 100;
  } else {
    result.quality = 2;
    if (queryArray.length > 0) {
      const key = queryArray[0][0];
      result.quality = getItemQuailty(query.data[key], result.stats[key].base, query.data.level, query.extra.isBoss);
    }
  }
  (Object.entries(result.stats) as Array<[string, any]>).forEach(([key, stat]) => {
    result.stats[key].values = getUpgradedStats(stat.base, result.quality, query.extra.isBoss, key, isWeapon)
  })
  return result;
}