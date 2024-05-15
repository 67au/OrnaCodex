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
