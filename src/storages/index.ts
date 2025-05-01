export * from './codex'

export async function saveStorage(store: LocalForage, data: Record<string, unknown>) {
  Object.entries(data).forEach(async ([k, v]) => {
    await store.setItem(k, v)
  })
}
