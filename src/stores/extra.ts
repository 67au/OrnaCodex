import { fetchBossScalingExtra, fetchEnemiesExtra, fetchExtraUpdate } from '@/api/extra'
import { useAppStorage } from '@/composables/storage'
import config from '@/config'
import { extraDb } from '@/db/extra'
import type { BossScaling, ExtraBossScaling } from '@/types/extra'
import { forEach, isNull } from 'es-toolkit/compat'
import diff from 'semver/functions/diff'

const extraStore = useAppStorage('extra')

export const useExtraState = defineStore('extra', () => {
  const bossScaling = shallowRef(new Map<string, BossScaling>())
  const lastUpdateAt: Ref<Date> = ref(new Date(0))
  const remoteUpdated: Ref<Date | undefined> = ref(undefined)

  async function initialize() {
    const extraStore = useAppStorage('extra')
    const bs = await extraStore.getItem<ExtraBossScaling>('boss_scaling')

    bossScaling.value.clear()
    forEach(bs ?? {}, (v, k) => {
      bossScaling.value.set(k, v)
    })

    lastUpdateAt.value = new Date((await extraStore.getItem('last_updated')) ?? 0)
  }

  async function update() {
    const { data: manifest } = await fetchExtraUpdate()
    if (isNull(manifest.value)) {
      return false
    }

    // check version
    const versionDiff = diff(manifest.value.version, config.version)
    if (!(versionDiff === 'minor' || isNull(versionDiff))) {
      return false
    }
    lastUpdateAt.value = new Date((await extraStore.getItem('last_updated')) ?? 0)
    const updateAt = new Date(manifest.value.last_updated)
    if (updateAt > lastUpdateAt.value) {
      const { enemies: enemiesFile, boss_scaling: bossScalingFile } = manifest.value.files
      const fetchEnemies = fetchEnemiesExtra(enemiesFile)
      const { data: bossScalingData } = await fetchBossScalingExtra(bossScalingFile)
      if (!isNull(bossScalingData.value)) {
        await extraStore.setItem('boss_scaling', bossScalingData.value)
      }
      const { data: enemiesData } = await fetchEnemies
      if (!isNull(enemiesData.value)) {
        await extraDb.enemies.clear()
        await extraDb.enemies.bulkAdd(enemiesData.value)
      }

      await extraStore.setItem('last_updated', manifest.value.last_updated)
      await extraStore.setItem('version', manifest.value.version)
      await extraStore.setItem('files', manifest.value.files)

      remoteUpdated.value = updateAt
      await initialize()
    }
  }

  return {
    bossScaling,
    remoteUpdated,
    lastUpdateAt,
    update,
    initialize,
  }
})
