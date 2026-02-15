import config from '@/config'
import { setParams, useFetch } from '.'
import type { ExtraBossScaling, ExtraEnemies, ExtraManifest } from '@/types/extra'

const useFetchExtra = useFetch(config.extraApiUrl)

export function fetchExtraUpdate() {
  const r = useFetchExtra(setParams('manifest.json'))
  return r.json<ExtraManifest>()
}

export function fetchBossScalingExtra(url: string) {
  const r = useFetchExtra(url)
  return r.json<ExtraBossScaling>()
}

export function fetchEnemiesExtra(url: string) {
  const r = useFetchExtra(url)
  return r.json<ExtraEnemies>()
}
