import type { CodexEntry } from '@/plugins/codex'

export interface CompareQuery {
  entry: CodexEntry
  query: {
    angLevel: number
    quality: number
    level: number
    bossScaling: number
    qualityCode: number
  }
}

export interface CompareResult {
  entry: CodexEntry
  quality: number
  stats: Record<
    string,
    {
      base: string
      diff?: number
    }
  >
}
