export interface ExtraMeta {
  version: string
  updated_at: string
  categories: Array<string>
}

export type BossScalingMap = Record<string, -1 | 0 | 1>

export interface Enemy {
  elementResistances?: Array<string>
  elementWeaknesses?: Array<string>
  elementImmunities?: Array<string>
  statusImmunities?: Array<string>
}
