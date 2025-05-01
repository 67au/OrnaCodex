import { CodexEntry, CodexEntryFactory } from '@/plugins/codex'

export const useEntriesListState = defineStore('entries-list', () => {
  const entires: Ref<Array<CodexEntry>> = shallowRef([])
  const index: Ref<number> = ref(0)
  const codex: Ref<Array<string>> = ref([])

  const length = computed(() => codex.value.length)
  const loadDone = ref()
  const chunkSize = 20
  function load({ done }: { done: CallableFunction }) {
    if (loadDone.value === undefined) {
      loadDone.value = done
    }
    done('loading')
    const minChunkSize = Math.min(chunkSize, codex.value.length - index.value)
    codex.value.slice(index.value, index.value + minChunkSize).forEach((key) => {
      entires.value.push(CodexEntryFactory.getEntryByKey(key))
    })
    triggerRef(entires)
    index.value += minChunkSize
    done('ok')
    if (index.value >= codex.value.length) {
      done('empty')
    }
  }

  function $reset() {
    entires.value = []
    index.value = 0
  }

  const render = () =>
    nextTick(() => {
      $reset()
      load({ done: loadDone.value })
    })

  return { codex, entires, length, load, $reset, render }
})
