import { useAppStorage } from '@/composables/storage'
import { yacoDb } from '@/db/codex'
import {
  type CodexEntryKey,
  type CodexData,
  type CodexEntryTranslationRaw,
  type PassiveAbilityRaw,
  type PendingUpdate,
} from '@/types/codex'
import type { CodexEntry } from '@/utils/codex'
import { isNull, isUndefined, pick, zipObject } from 'es-toolkit'
import { i18n } from '@/i18n'
import { fetchCodexData, fetchCodexI18n, fetchCodexUpdate } from '@/api/codex'
import { supportedLocales } from '@/i18n/config'
import diff from 'semver/functions/diff'
import config from '@/config'

export const useCodexState = defineStore('codex', () => {
  const meta: ShallowRef<CodexData['meta']> = shallowRef({
    icons: {},
    options: {},
    sorts: {},
    ability_stats: {},
    value_types: {},
  })

  const entries = shallowRef(new Map<string, CodexEntry>())
  const translations = shallowRef(new Map<string, CodexEntryTranslationRaw>())
  const abilities = shallowRef(new Map<string, PassiveAbilityRaw>())

  const gearEntries = computed(() =>
    Array.from(entries.value.values())
      .filter((entry) => entry.category === 'items' && entry.isAssessable)
      .sort((a, b) => {
        if (a.tier === b.tier) {
          return 0
        }
        const ta = a.tier ?? 0
        const tb = b.tier ?? 0
        return tb - ta
      }),
  )

  const enemyEntries = computed(() => {
    return Array.from(entries.value.values())
      .filter((entry) => config.enemySet.has(entry.category))
      .sort((a, b) => {
        if (a.tier === b.tier) {
          return 0
        }
        const ta = a.tier ?? 0
        const tb = b.tier ?? 0
        return tb - ta
      })
  })

  const enemyOrderMap = computed(() => {
    const orderMap = new Map<CodexEntryKey, number>()
    enemyEntries.value.forEach((entry, index) => {
      orderMap.set(entry.key, index)
    })
    return orderMap
  })

  const materialEntries = computed(() => {
    return Array.from(entries.value.values())
      .filter((entry) => entry.isMaterial)
      .sort((a, b) => {
        if (a.tier === b.tier) {
          return 0
        }
        const ta = a.tier ?? 0
        const tb = b.tier ?? 0
        return tb - ta
      })
  })

  async function updateEntriesTranslation(locale: string) {
    const cacheTranslations = await yacoDb.translations.where('language').equals(locale).toArray()
    if (isUndefined(cacheTranslations)) {
      return false
    }

    const m = new Map()
    cacheTranslations.forEach((t) =>
      m.set(t.category + '/' + t.id, pick(t, ['name', 'description'])),
    )
    translations.value = m
    return true
  }

  async function updateAbilitiesTranslation(locale: string) {
    const cacheAbilitiesTranslations = await yacoDb.abilities
      .where('language')
      .equals(locale)
      .toArray()
    if (isUndefined(cacheAbilitiesTranslations)) {
      return false
    }

    const m = new Map()
    cacheAbilitiesTranslations.forEach((t) => m.set(t.id, pick(t, ['name', 'description'])))
    abilities.value = m
    return true
  }

  async function updateTranslation(locale: string) {
    const r = await Promise.all([
      updateEntriesTranslation(locale),
      updateAbilitiesTranslation(locale),
    ])
    return r.every((s) => s)
  }

  async function loadLocaleMessages(locale: string) {
    const msg = await yacoDb.msg.get(locale)
    if (isUndefined(msg)) {
      return false
    }
    i18n.global.mergeLocaleMessage(locale, msg.msg)
    return true
  }

  const lastUpdateAt: Ref<Date | undefined> = ref(undefined)
  const remoteUpdated: Ref<Date | undefined> = ref(undefined)

  async function update() {
    const { data: manifest } = await fetchCodexUpdate()
    if (isNull(manifest.value)) {
      return false
    }
    const versionDiff = diff(manifest.value.version, config.version)
    if (!(versionDiff === 'minor' || isNull(versionDiff))) {
      return false
    }
    const yacoStore = useAppStorage('yaco')
    const lastUpdated = new Date((await yacoStore.getItem('last_updated')) ?? 0)
    const updateAt = new Date(manifest.value.last_updated)
    const { codex: codexFile, locales: localeFiles } = manifest.value.files
    if (updateAt > lastUpdated) {
      const fetchData = fetchCodexData(codexFile)
      const translations = await Promise.all(
        supportedLocales.map(async (locale) => {
          const localeFile = localeFiles[locale]
          if (isUndefined(localeFile)) {
            return {
              locale: locale,
              data: null,
            }
          }
          const { data: localeData } = await fetchCodexI18n(localeFile)
          return {
            locale: locale,
            data: localeData.value,
          }
        }),
      )

      const { data: codexData } = await fetchData
      if (isNull(codexData.value) || translations.some((t) => isNull(t.data))) {
        return false
      }

      const pendingUpdate: PendingUpdate = {
        manifest: manifest.value,
        codex: codexData.value,
        locales: translations as PendingUpdate['locales'],
      }

      await yacoStore.setItem('pending_update', pendingUpdate)
      remoteUpdated.value = updateAt

      return true
    }
    return false
  }

  async function initialize() {
    const yacoStore = useAppStorage('yaco')
    lastUpdateAt.value = new Date((await yacoStore.getItem('last_updated')) ?? 0)

    const metaKeys: Array<keyof CodexData['meta']> = [
      'icons',
      'options',
      'sorts',
      'ability_stats',
      'value_types',
    ]
    const cache = await yacoStore.getItems(metaKeys)
    if (cache.some((s) => isUndefined(s))) {
      return false
    }

    meta.value = zipObject(metaKeys, cache) as CodexData['meta']

    const cacheEntries = await yacoDb.entries.toArray()
    if (isUndefined(cacheEntries)) {
      return false
    }
    cacheEntries.forEach((e) => entries.value.set(e.category + '/' + e.id, e))

    if (!(await updateTranslation(i18n.global.locale.value))) {
      return false
    }

    return true
  }

  return {
    initialize,
    update,
    updateTranslation,
    updateEntriesTranslation,
    updateAbilitiesTranslation,
    loadLocaleMessages,
    meta,
    entries,
    translations,
    abilities,
    lastUpdateAt,
    remoteUpdated,
    gearEntries,
    enemyEntries,
    enemyOrderMap,
    materialEntries,
  }
})
