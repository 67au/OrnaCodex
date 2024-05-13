export function isCelestial(item: any) {
  return item['rarity'] === 'celestial';
}

export function isWeapon(item: any) {
  return item['item_type'] === 'weapon';
}

export function isArmor(item: any) {
  return item['item_type'] === 'armor';
}

export function isAdornment(item: any) {
  return item['item_type'] === 'adornment';
}

export function isOffHand(item: any) {
  return item['place'] === 'off-hand';
}

export function isAccessory(item: any) {
  return item['place'] === 'accessory';
}

export function isCelestialWeapon(item: any) {
  return isCelestial(item) && isWeapon(item);
}

export function isUpgradable(item: any) {
  return (isWeapon(item) && !isAdornment(item)) || (isArmor(item) && !isAccessory(item))
}

export function isUpgradableSlots(item: any) {
  return isUpgradable(item) && !isOffHand(item);
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

export function getQualityName(item: any, quality: number) {
  var p;
  p = -1;
  const qual = Math.round(quality * 100);
  if (qual >= 70) { p++ };
  if (qual >= 90) { p++ };
  if (qual > 99) { p++ }
  if (qual > 100) { p++ };
  if (qual >= 120) { p++ };
  if (qual >= 140) { p++ };
  if (qual >= 170) { p++ };
  if (qual > 200) {
    if (isAccessory(item)) {
      if (qual > 200) { p++ };
      if (qual > 205) { p++ };
      if (qual > 210) { p = -1};
    } else { p = -1; }
  }

  return Quality[p];
}
