import { useCodexState } from './codex'
import { useExtraState } from './extra'
import { useWorkerState } from './worker'

export const useAppState = defineStore('app', () => {
  const codexState = useCodexState()
  const extraState = useExtraState()
  const workerState = useWorkerState()

  const isInited = shallowRef(false)
  const isUpdated = shallowRef(false)
  const isUpdating = shallowRef(true)

  const isLoading = computed(() => !isInited.value)

  async function initData() {
    let loaded = await codexState.initCodexData()
    isUpdated.value = await codexState.useFetchCodex()
    if (!loaded) {
      loaded = await codexState.initCodexData()
      isUpdating.value = false
    }
    if (loaded) {
      workerState.setInit()
      workerState.setI18n()
    }
    isInited.value = true

    await extraState.initExtraData()
    if (await extraState.useFetchExtra()) {
      await extraState.initExtraData()
    }
  }

  return {
    inited: isInited,
    updated: isUpdated,
    isUpdating,
    isLoading,
    initData,
  }
})
