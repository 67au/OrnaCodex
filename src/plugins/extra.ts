import { global } from './global'

export async function fetchExtra() {
  if (global.extraApiUrl === '') {
    return undefined
  }
  await fetch(`${global.extraApiUrl}/codex/items/meta.json`)
    .then((resp) => resp.json())
    .then((data) => {
      return data
    })
    .catch(() => {
      return undefined
    })
}
