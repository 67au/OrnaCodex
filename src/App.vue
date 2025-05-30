<script setup lang="ts">
import InitLoader from '@/components/InitLoader.vue'
import { useAppState } from './stores/app'

const appState = useAppState()

onMounted(async () => {
  await appState.initData()
})
</script>

<template>
  <InitLoader v-if="appState.isLoading"></InitLoader>
  <template v-else>
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HomeView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </template>
</template>
