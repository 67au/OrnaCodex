import type { CodexId } from '@/types'
import { defineStore, storeToRefs } from 'pinia'
import { useCodexState } from './codex'

export const useEntriesListState = defineStore('entries-list', {
  state: () => ({
    entries: [] as Array<CodexId>,
    index: 0,
    loading: false,
    finished: false
  }),
  getters: {
    render() {
      return useDebounceFn(
        () => {
          const list = useEntriesListState()
          list.$reset()
          list.load()
        },
        750,
        { maxWait: 1200 }
      )
    }
  },
  actions: {
    load() {
      this.loading = true
      const codexSorted = storeToRefs(useCodexState()).sorted.value
      const chunkSize = 40
      const minChunkSize = Math.min(chunkSize, codexSorted.length - this.index)
      for (let i = 0; i < minChunkSize; i++) {
        this.entries.push(codexSorted[this.index + i])
      }
      this.index += minChunkSize
      this.loading = false
      if (this.index >= codexSorted.length) {
        this.finished = true
      }
    }
  }
})
