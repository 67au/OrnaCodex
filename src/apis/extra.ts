import { useExtraFetch } from '@/request/extra'
import { setParams } from '.'

export function getUpdate() {
  const extraFetch = useExtraFetch(setParams('/index.json'))
  return extraFetch.json()
}

export function getBossScaling() {
  const extraFetch = useExtraFetch(setParams('/boss_scaling.json'))
  return extraFetch.json()
}

export function getExtra(category: string) {
  const extraFetch = useExtraFetch(setParams(`/${category}.json`))
  return extraFetch.json()
}

export function getEnemy() {
  const enemyCategories = ['bosses', 'monsters', 'raids']
  const enemyFetch = Promise.allSettled(
    enemyCategories.map(async (category) => {
      const { data } = await useExtraFetch(setParams(`/${category}.json`)).json()
      return [category, data.value]
    }),
  )
  return enemyFetch
}
