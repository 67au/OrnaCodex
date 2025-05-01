import { getBossScaling, getEntryExtra, getUpdate } from '@/apis/extra'
import config from '@/config'
import type { CodexEntry } from '@/plugins/codex'
import { extraStorage } from '@/storages/extra'
import type { BossScalingMap, ExtraMeta } from '@/types/extra'

export const useExtraState = defineStore('extra', () => {
  const bossScaling: Ref<BossScalingMap> = shallowRef({})
  const version: Ref<string> = shallowRef('')
  const updatedAt: Ref<Date> = shallowRef(new Date(0))

  async function useSetExtra() {
    version.value = (await extraStorage.getItem('version')) ?? ''
    if (version.value !== '' && version.value !== config.version) {
      return false
    }

    bossScaling.value = (await extraStorage.getItem('bossScaling')) as BossScalingMap
    updatedAt.value = new Date((await extraStorage.getItem('updatedAt')) ?? 0)

    return true
  }

  async function useFetchExtra() {
    const { data: update } = await getUpdate()
    const meta = update.value as ExtraMeta
    const lastUpdatedAt = new Date(meta.updated_at)

    if (lastUpdatedAt > updatedAt.value) {
      const { data: bossScaling } = await getBossScaling()
      await extraStorage.setItem('bossScaling', bossScaling.value)
      await extraStorage.setItem('version', meta.version)
      await extraStorage.setItem('updatedAt', meta.updated_at)

      await useSetExtra()
      return true
    }
    return false
  }

  async function useFetchEntry(entry: CodexEntry) {
    // ToDo
    const entryExtra = getEntryExtra(entry.category, entry.id)
    return entryExtra
  }
  return { bossScaling, version, updatedAt, useSetExtra, useFetchExtra, useFetchEntry }
})
