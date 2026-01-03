<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
</script>

<template>
  <AppLoader>
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HomeView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </AppLoader>
</template>
