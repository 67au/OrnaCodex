import type { CodexEntryKey } from './codex'

export type BossScaling = -1 | 0 | 1

export interface ExtraManifest {
  version: string
  last_updated: string
  files: {
    enemies: string
    boss_scaling: string
  }
}

export interface ExtraBossScaling {
  [id: string]: BossScaling
}

export interface EnemyData {
  elementWeaknesses?: Array<string>
  elementImmunities?: Array<string>
  elementResistances?: Array<string>
  statusImmunities?: Array<string>
}

export interface Enemy {
  id: CodexEntryKey
  data: EnemyData
}

export type ExtraEnemies = Array<Enemy>
