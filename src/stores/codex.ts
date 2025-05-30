import { getCodex, getI18n, getUpdate } from '@/apis/codex'
import config from '@/config'
import { i18n } from '@/i18n'
import { codexStorage, saveStorage } from '@/storages'
import type { CodexEntries, CodexMeta, CodexTranslation } from '@/types/codex'
import type { CodexEntryKeys, Sorts } from '@/types/filters'
import { isNull } from 'es-toolkit'

export const useCodexState = defineStore('codex', () => {
  const codex: Ref<CodexEntries | null> = shallowRef({})
  const icons: Ref<Record<string, string>> = shallowRef({})
  const options: Ref<Record<string, Array<string>>> = shallowRef({})
  const sorts: Ref<Sorts> = shallowRef({})

  const baseStats: Ref<Array<string>> = shallowRef([])
  const translation: Ref<CodexTranslation> = shallowRef({})

  const version: Ref<string | null> = ref(null)
  const updatedAt: Ref<Date | null> = ref(null)

  async function loadLocaleMessages() {
    const tr: CodexTranslation | null = await codexStorage.getItem(
      `translation/${i18n.global.locale.value}`,
    )
    if (tr !== null) {
      translation.value = { main: tr.main, abilities: tr.abilities }
      i18n.global.mergeLocaleMessage(i18n.global.locale.value, tr.msg)
    }
  }

  async function initCodexData() {
    const [
      cachedVersion,
      cachedMain,
      cachedIcons,
      cachedOptions,
      cachedSorts,
      cachedBaseStats,
      cachedTimestamp,
    ] = await Promise.all([
      codexStorage.getItem('version'),
      codexStorage.getItem('main'),
      codexStorage.getItem('icons'),
      codexStorage.getItem('options'),
      codexStorage.getItem('sorts'),
      codexStorage.getItem('base_stats'),
      codexStorage.getItem('updatedAt'),
    ])

    if (cachedVersion !== null && cachedVersion === config.version) {
      if (cachedMain) {
        version.value = cachedVersion
        codex.value = cachedMain as CodexEntries
        icons.value = cachedIcons as Record<string, string>
        options.value = cachedOptions as Record<CodexEntryKeys, Array<string>>
        sorts.value = cachedSorts as Sorts
        baseStats.value = cachedBaseStats as Array<string>
        updatedAt.value = new Date((cachedTimestamp ?? 0) as number)
        await loadLocaleMessages()
        return true
      }
    }
    return false
  }

  async function useFetchCodex() {
    const { data: update } = await getUpdate()
    const meta = update.value as CodexMeta
    const lastUpdatedAt = new Date(meta.updated_at)

    if (isNull(updatedAt.value) || lastUpdatedAt > updatedAt.value) {
      const prefetchCodex = getCodex()
      // Translations
      const translations = await Promise.all(Object.keys(meta.i18n).map((lang) => getI18n(lang)))
      translations.forEach(async (tr) => {
        const { data } = tr
        await codexStorage.setItem(`translation/${data.value.language}`, data.value)
      })
      // Codex
      const { data } = await prefetchCodex
      await saveStorage(codexStorage, data.value)
      await codexStorage.setItem('version', meta.version)
      await codexStorage.setItem('updatedAt', meta.updated_at)
      return true
    }
    return false
  }

  return {
    codex,
    icons,
    options,
    sorts,
    baseStats,
    translation,
    version,
    updatedAt,
    initCodexData,
    useFetchCodex,
    getTranslation: loadLocaleMessages,
  }
})
