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

export function getEntryExtra(category: string, id: string) {
  const extraFetch = useExtraFetch(setParams(`/${category}/${id}.json`))
  return extraFetch.json()
}
