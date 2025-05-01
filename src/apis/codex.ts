import { useCodexFetch } from '@/request/codex'
import { setParams } from '.'

export function getUpdate() {
  const codexFetch = useCodexFetch(setParams('/index.json'))
  return codexFetch.json()
}

export function getCodex() {
  const codexFetch = useCodexFetch(setParams('/codex.json'))
  return codexFetch.json()
}

export function getI18n(language: string) {
  const codexFetch = useCodexFetch(setParams(`/i18n/${language}.json`))
  return codexFetch.json()
}
