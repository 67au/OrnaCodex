<script setup lang="ts">
import AppLoader from './components/AppLoader.vue'
import { useMessagesState } from './stores/messages'

const messageState = useMessagesState()

const route = useRoute()
</script>

<template>
  <AppLoader>
    <component :is="route.meta.layout">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
        </KeepAlive>
        <component :is="Component" v-if="!route.meta.keepAlive" />
      </RouterView>
    </component>
    <v-snackbar-queue
      location="top"
      v-model="messageState.queue"
      timeout="2500"
      :total-visible="5"
      collapsed
    />
  </AppLoader>
</template>

<style scoped></style>
