import type { CodexEntry } from '@/plugins/codex'
import type { StatValue } from './codex'

export type BossScaling = -1 | 0 | 1

export interface AssessQuery {
  query: Record<string, number>
  options: {
    bossScaling: number
    isQualityCalc: boolean
    baseStats: Record<string, number>
    ///
    // isWeapon: boolean
    isCelestialWeapon: boolean
    isTwoHanded: boolean
    isUpgradable: boolean
    isOffHand: boolean
  }
}

export interface AssessResult {
  quality: number
  angLevel: number
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

export interface QualityQuery {
  entry: CodexEntry
  query: {
    angLevel: number
    quality: number
    level: number
    bossScaling: number
    qualityCode: number
  }
}

export interface QualityResult {
  entry: CodexEntry
  query: QualityQuery['query']
  stats: Record<string, StatValue>
}
