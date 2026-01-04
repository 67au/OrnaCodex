<script setup lang="ts">
import { useAppState } from '@/stores/app'
import { mdiArrowUpBoldCircle } from '@mdi/js'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
const appState = useAppState()
const show = computed(() => needRefresh.value || appState.updated)

async function reloadPage() {
  await updateServiceWorker(true)
  nextTick(() => setTimeout(() => window.location.reload(), 1000))
}
</script>

<template>
  <v-scroll-y-transition>
    <v-banner
      :text="$t('update.title')"
      lines="one"
      sticky
      elevation="2"
      style="top: 56px"
      color="info"
      v-if="show"
    >
      <template v-slot:prepend>
        <v-icon color="info" :icon="mdiArrowUpBoldCircle" size="large"></v-icon>
      </template>
      <template v-slot:actions>
        <v-btn color="info" :text="$t('update.refresh')" @click="reloadPage"></v-btn>
      </template>
    </v-banner>
  </v-scroll-y-transition>
</template>
