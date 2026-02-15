import { useAppStorage } from '@/composables/storage'
import { yacoDb } from '@/db/codex'
import type { KeyValue } from '@/db/kv'
import type { PendingUpdate } from '@/types/codex'
import { forEachAsync, isNull, isUndefined } from 'es-toolkit'
import { useCodexState } from './codex'
import type { CodexEntry } from '@/utils/codex'
import { useQueryState } from './query'
import { i18n } from '@/i18n'
import { forEach } from 'es-toolkit/compat'
import { useExtraState } from './extra'
import config from '@/config'
import diff from 'semver/functions/diff'

const yacoStore = useAppStorage('yaco')

type AppState = 'LOADING' | 'UPDATE' | 'FINISHED' | 'FAILED' | undefined

export const useAppState = defineStore('app', () => {
  const state: Ref<AppState> = ref()

  async function handleUpdate() {
    const pendingUpdate = (await yacoStore.getItem('pending_update')) as PendingUpdate | undefined
    if (isUndefined(pendingUpdate)) {
      return false
    }
    await yacoStore.removeItem('pending_update')

    const manifest = pendingUpdate.manifest
    const versionDiff = diff(manifest.version, config.version)
    if (!(versionDiff === 'minor' || isNull(versionDiff))) {
      return false
    }
    const lastUpdateAt = new Date((await yacoStore.getItem('last_updated')) ?? 0)
    const updateAt = new Date(manifest.last_updated)
    if (updateAt > lastUpdateAt) {
      state.value = 'UPDATE'

      const meta = pendingUpdate.codex.meta
      const metaBulk: Array<KeyValue> = []
      // codex
      forEach(meta, (v, k) => {
        metaBulk.push({ key: k, value: v })
      })
      metaBulk.push({ key: 'last_updated', value: manifest.last_updated })
      metaBulk.push({ key: 'version', value: manifest.version })
      metaBulk.push({ key: 'files', value: manifest.files })

      await yacoDb.entries.clear()
      await yacoDb.entries.bulkPut(pendingUpdate.codex.entries as Array<CodexEntry>)

      await yacoDb.translations.clear()
      await yacoDb.abilities.clear()
      await yacoDb.msg.clear()

      await forEachAsync(pendingUpdate.locales, async (t) => {
        const { locale: language, data } = t
        await yacoDb.translations.bulkPut(data.entries)
        await yacoDb.abilities.bulkPut(data.abilities)
        await yacoDb.msg.put({ language: language, msg: data.msg })
      })

      await yacoStore.setItems(metaBulk)

      const queryState = useQueryState()
      await queryState.purgeCache()

      const codexState = useCodexState()
      codexState.remoteUpdated = undefined

      return true
    }
    return false
  }

  async function initYaco() {
    // load codex
    const codexState = useCodexState()
    if (!(await codexState.initialize())) {
      return false
    }
    // load translations
    if (!(await codexState.loadLocaleMessages(i18n.global.locale.value))) {
      return false
    }
    // load query index
    const queryState = useQueryState()
    if (!(await queryState.initialize())) {
      return false
    }

    return true
  }

  async function forceUpdate() {
    await yacoDb.translations.clear()
    await yacoDb.abilities.clear()
    await yacoDb.msg.clear()

    await yacoStore.removeItem('pending_update')
    await yacoStore.removeItem('last_updated')
  }

  async function initialize() {
    await handleUpdate()

    const codexState = useCodexState()
    const updateTask = codexState.update()

    if (!(await initYaco())) {
      state.value = 'LOADING'
      await updateTask
      await handleUpdate()
      if (!(await initYaco())) {
        state.value = 'FAILED'
        return
      }
    }
    const extraState = useExtraState()
    await extraState.initialize()
    const extraTask = extraState.update()

    state.value = 'FINISHED'
    await extraTask
    await updateTask
  }

  return { initialize, forceUpdate, state }
})
