export type BossScaling = -1 | 0 | 1

export interface AssessQuery {
  query: Record<string, number>
  options: {
    bossScaling: number
    isQualityCalc: boolean
    baseStats: Record<string, number>
    ///
    isWeapon: boolean
    isCelestialWeapon: boolean
    isTwoHanded: boolean
    isUpgradable: boolean
    isOffHand: boolean
  }
}

export interface AssessResult {
  quality: number
  stats: {
    [key: string]: {
      base: number
      values: Array<number>
    }
  }
  levels: number
  //
  exact?: boolean
  range?: [number, number]
}
