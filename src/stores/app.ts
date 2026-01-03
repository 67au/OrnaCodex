import { useCodexState } from './codex'
import { useExtraState } from './extra'
import { useWorkerState } from './worker'

export const useAppState = defineStore('app', () => {
  const codexState = useCodexState()
  const extraState = useExtraState()
  const workerState = useWorkerState()

  const loading = shallowRef(false)
  const updated = shallowRef(false)
  const finished = shallowRef(false)

  async function initData() {
    const updateTask = codexState.useFetchCodex()
    let inited = await codexState.initCodexData()
    if (!inited) {
      loading.value = true
      updated.value = await updateTask
      inited = await codexState.initCodexData()
    }
    if (inited) {
      workerState.setInit()
      workerState.setI18n()
      finished.value = true
    }
    loading.value = false

    updated.value = await updateTask
    await extraState.initExtraData()
    if (await extraState.useFetchExtra()) {
      await extraState.initExtraData()
    }
  }

  return {
    updated,
    loading,
    finished,
    initData,
  }
})
