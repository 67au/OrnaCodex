function getDelta(base, isBoss) {
  if (isBoss) {
    return base > 0 ? Math.ceil(base / 8) : Math.ceil(base / -300);
  } else {
    return base > 0 ? Math.ceil(base / 10) : Math.ceil(base / -75);
  }
}


export function getUpgradedStats(base, quality, isBoss, key = undefined, isWeapon = false) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level) => quality + (level - 10) / 100;
  if (key === 'crit' ) {
    return Array(13).fill(base);
  }
  if (key === 'dexterity' || (isWeapon && (key === 'hp' || key === 'mana'))) {
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

export function getUpgradedStat(base, level, quality, isBoss) {
  const delta = getDelta(base, isBoss);
  const quality_plus = (level) => quality + (level - 10) / 100;
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

export function getItemQuailty(input, base, level, isBoss) {
  const delta = level>10?(level-10)/100:0;
  const base_stat = getUpgradedStat(base, level, 1, isBoss);
  const quality = Math.round(((input / base_stat) * (1+delta) - delta) * 100) / 100;
  return quality
}