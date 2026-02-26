import type { BossScaling } from './extra'
import type { CodexEntryKey, CodexEntryRaw, StatValue } from './codex'
import type { CodexEntry } from '@/utils/codex'

export interface AssessQuery {
  input: {
    entry: CodexEntry
    level: number
    angLevel: number
    quality: number
    bossScaling: BossScaling
    qualityCode: number
    stats: Record<string, number>
  }
  meta: {
    baseStats: Exclude<CodexEntryRaw['stats'], undefined>
    flags: {
      isAdornment: boolean
      isAccessory: boolean
      isCelestialWeapon: boolean
      isTwoHanded: boolean
      isUpgradable: boolean
      hasScalingSlots: boolean
    }
  }
}

export interface ResultStat {
  base: number
  values: Array<number>
}

export interface AssessResult {
  entry: CodexEntry
  angLevel: number
  quality: number
  bossScaling: BossScaling
  qualityCode: number
  stats: Record<string, ResultStat>
  levels: 0 | 1 | 13 | 20
  //
  exact?: boolean
  range?: [number, number]
}

export interface FullResult {
  entry: CodexEntry
  level: number
  angLevel: number
  quality: number
  bossScaling: BossScaling
  qualityCode: number
  stats: AssessQuery['meta']['baseStats']
}

export interface CompareQuery {
  key: CodexEntryKey
  quality: AssessQuery['input']['quality']
  qualityCode: AssessQuery['input']['qualityCode']
  angLevel: AssessQuery['input']['angLevel']
  level: AssessQuery['input']['level']
  bossScaling: AssessQuery['input']['bossScaling']
}

export interface DiffStat {
  base: StatValue | undefined
  diff: number
}
export interface CompareResult {
  entry: CodexEntry
  level: number
  angLevel: number
  quality: number
  bossScaling: BossScaling
  qualityCode: number
  stats: Record<string, DiffStat>
}
