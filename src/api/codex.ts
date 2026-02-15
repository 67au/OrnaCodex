import config from '@/config'
import { setParams, useFetch } from '.'
import { type CodexData, type CodexManifest, type CodexDataTranslation } from '@/types/codex'

const useFetchCodex = useFetch(config.apiUrl)

export function fetchCodexUpdate() {
  const r = useFetchCodex(setParams('manifest.json'))
  return r.json<CodexManifest>()
}

export function fetchCodexData(endpoint: string) {
  const r = useFetchCodex(endpoint)
  return r.json<CodexData>()
}

export function fetchCodexI18n(endpoint: string) {
  const r = useFetchCodex('locales/' + endpoint)
  return r.json<CodexDataTranslation>()
}
