<script setup lang="ts">
import InitLoader from '@/components/InitLoader.vue'
import { useCodexState } from '@/stores/codex'
import { useAsyncState } from '@vueuse/core'
import { useExtraState } from './stores/extra'
const codexState = useCodexState()
const extraState = useExtraState()

const { isReady } = useAsyncState(() => codexState.useSetCodex(), false)

watch(
  isReady,
  async () => {
    await codexState.useFetchCodex()
  },
  { once: true },
)

const { isReady: isExtraReady } = useAsyncState(() => extraState.useSetExtra(), false)
watch(
  isExtraReady,
  async () => {
    await extraState.useFetchExtra()
  },
  { once: true },
)
</script>

<template>
  <InitLoader v-if="codexState.isLoading"></InitLoader>
  <template v-else>
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HomeView|AssessView|ProofView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </template>
</template>
