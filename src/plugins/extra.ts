import { global } from './global'

export async function fetchExtra(): Promise<any | undefined> {
  if (global.extraApiUrl === '') {
    return undefined
  }
  return await fetch(`${global.extraApiUrl}/codex/items/meta.json`)
    .then((resp) => resp.json())
    .then((data) => {
      return data
    })
    .catch(() => {
      return undefined
    })
}
