import { getCodex, getI18n, getUpdate } from '@/apis/codex'
import config from '@/config'
import { i18n } from '@/i18n'
import { codexStorage, saveStorage } from '@/storages'
import type { CodexEntries, CodexMeta, CodexTranslation } from '@/types/codex'
import type { CodexEntryKeys, Sorts } from '@/types/filters'

export const useCodexState = defineStore('codex', () => {
  const codex: Ref<CodexEntries | null> = shallowRef({})
  const icons: Ref<Record<string, string>> = shallowRef({})
  const options: Ref<Record<string, Array<string>>> = shallowRef({})
  const sorts: Ref<Sorts> = shallowRef({})

  const baseStats: Ref<Array<string>> = shallowRef([])
  const translation: Ref<CodexTranslation> = shallowRef({})

  const version: Ref<string> = ref('')
  const updatedAt: Ref<Date> = ref(new Date(0))
  const isLoading = ref(true)
  const isUpdated = ref(false)
  const isUpdating = ref(true)

  async function getTranslation() {
    const tr: CodexTranslation | null = await codexStorage.getItem(
      `translation/${i18n.global.locale.value}`,
    )
    if (tr !== null) {
      translation.value = { main: tr.main, abilities: tr.abilities }
      i18n.global.mergeLocaleMessage(i18n.global.locale.value, tr.msg)
    }
  }

  async function useSetCodex() {
    version.value = (await codexStorage.getItem('version')) ?? ''
    if (version.value !== '' && version.value !== config.version) {
      isLoading.value = true
      isUpdating.value = false
      return isLoading.value
    }

    codex.value = (await codexStorage.getItem('main')) as CodexEntries
    icons.value = (await codexStorage.getItem('icons')) as Record<string, string>
    options.value = (await codexStorage.getItem('options')) as Record<CodexEntryKeys, Array<string>>
    sorts.value = (await codexStorage.getItem('sorts')) as Sorts
    baseStats.value = (await codexStorage.getItem('base_stats')) as Array<string>

    updatedAt.value = new Date((await codexStorage.getItem('updatedAt')) ?? 0)
    await getTranslation()
    isLoading.value = false

    return isLoading.value
  }

  async function useFetchCodex() {
    const { data: update } = await getUpdate()
    const meta = update.value as CodexMeta
    const lastUpdatedAt = new Date(meta.updated_at)

    if (lastUpdatedAt > updatedAt.value) {
      const prefetchCodex = getCodex()
      // Translations
      const translations = await Promise.allSettled(
        Object.keys(meta.i18n).map((lang) => getI18n(lang)),
      )
      translations.forEach(async (tr) => {
        if (tr.status === 'fulfilled') {
          const { data } = tr.value
          await codexStorage.setItem(`translation/${data.value.language}`, data.value)
        }
      })
      // Codex
      const { data } = await prefetchCodex
      await saveStorage(codexStorage, data.value)
      await codexStorage.setItem('version', meta.version)
      await codexStorage.setItem('updatedAt', meta.updated_at)
      if (isLoading.value) {
        await useSetCodex()
      } else {
        isUpdated.value = true
      }

      return isUpdated.value
    }
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
    isLoading,
    isUpdated,
    isUpdating,
    useSetCodex,
    useFetchCodex,
    getTranslation,
  }
})
