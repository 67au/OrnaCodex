import { getBossScaling, getEnemy, getUpdate } from '@/apis/extra'
import config from '@/config'
import { extraStorage } from '@/storages/extra'
import type { BossScalingMap, Enemy, ExtraMeta } from '@/types/extra'
import { isNull, mapKeys, merge } from 'es-toolkit'

export const useExtraState = defineStore('extra', () => {
  const bossScaling: Ref<BossScalingMap> = shallowRef({})
  const version: Ref<string | null> = shallowRef(null)
  const updatedAt: Ref<Date> = shallowRef(new Date(0))
  const enemy: Ref<Record<string, Enemy>> = shallowRef({})

  async function initExtraData() {
    // version.value = (await extraStorage.getItem('version')) ?? ''
    // if (version.value !== '' && version.value !== config.version) {
    //   return false
    // }

    // bossScaling.value = (await extraStorage.getItem('bossScaling')) as BossScalingMap
    // updatedAt.value = new Date((await extraStorage.getItem('updatedAt')) ?? 0)
    // enemy.value = (await extraStorage.getItem('enemy')) ?? {}

    // return true
    const [cachedVersion, cachedBossScaling, cachedEnemy, cachedTimestamp] = await Promise.all([
      extraStorage.getItem('version'),
      extraStorage.getItem('bossScaling'),
      extraStorage.getItem('enemy'),
      extraStorage.getItem('updatedAt'),
    ])
    if (cachedVersion !== null && cachedVersion === config.version) {
      if (cachedEnemy) {
        version.value = cachedVersion
        bossScaling.value = cachedBossScaling as BossScalingMap
        updatedAt.value = new Date((cachedTimestamp ?? 0) as number)
        enemy.value = (cachedEnemy ?? {}) as Record<string, Enemy>
        return true
      }
    }
    return false
  }

  async function useFetchExtra() {
    const { data: update } = await getUpdate()
    const meta = update.value as ExtraMeta
    const lastUpdatedAt = new Date(meta.updated_at)

    if (isNull(updatedAt.value) || lastUpdatedAt > updatedAt.value) {
      const { data: bossScaling } = await getBossScaling()
      const enemies = await getEnemy()
      const enemy = enemies
        .map((e) => {
          if (e.status === 'fulfilled') {
            const [k, v] = e.value
            return mapKeys(v, (_, key) => `${String(k)}/${String(key)}`)
          }
          return {}
        })
        .reduce((acc, d) => merge(acc, d))

      await extraStorage.setItem('enemy', enemy)
      await extraStorage.setItem('bossScaling', bossScaling.value)
      await extraStorage.setItem('version', meta.version)
      await extraStorage.setItem('updatedAt', meta.updated_at)
      return true
    }
    return false
  }

  return { bossScaling, enemy, version, updatedAt, initExtraData, useFetchExtra }
})
