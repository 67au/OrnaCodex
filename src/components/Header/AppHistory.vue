<script setup lang="ts">
import { useHistoryState } from '@/stores/history'
import router from '@/router'
import { CodexEntry } from '@/plugins/codex'
import type { CodexCategory } from '@/types'
</script>

<template>
  <var-button text-color="#fff" text round @click="show = true">
    <div class="i-mdi-history text-xl" />
  </var-button>
  <HistoryTool v-model:show="show" />
</template>

<script lang="ts">
export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    const historyStorage = useLocalStorage('history', this.historyState.string)
    this.historyState.initialize(JSON.parse(historyStorage.value))

    const saveHistory = useDebounceFn(
      () => {
        historyStorage.value = this.historyState.string
      },
      500,
      { maxWait: 1000 }
    )

    watch(
      () => this.historyState.map.size,
      () => {
        saveHistory()
      },
      { immediate: true }
    )

    router.afterEach((to, from) => {
      if (to.name === 'codex') {
        const entry = new CodexEntry(to.params.category as CodexCategory, to.params.id as string)
        if (entry.meta !== undefined) {
          this.historyState.add(entry)
        }
      }
    })
  },
  computed: {
    historyState() {
      return useHistoryState()
    }
  }
}
</script>
