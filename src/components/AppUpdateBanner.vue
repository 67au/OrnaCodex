<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { mdiArrowUpCircle, mdiRefreshCircle } from '@mdi/js'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()

async function reloadPage() {
  await updateServiceWorker(true)
  nextTick(() => setTimeout(() => window.location.reload(), 1000))
}

const codexState = useCodexState()
</script>

<template>
  <v-banner
    :text="$t('update.web')"
    lines="one"
    stacked
    color="info"
    v-if="needRefresh"
    sticky
    style="top: 56px"
  >
    <template v-slot:actions>
      <v-btn
        color="info"
        :text="$t('update.reload')"
        class="text-uppercase"
        @click="reloadPage"
        :append-icon="mdiArrowUpCircle"
      />
    </template>
  </v-banner>

  <v-banner
    lines="one"
    stacked
    color="info"
    v-else-if="codexState.remoteUpdated"
    sticky
    style="top: 56px"
  >
    <template v-slot:actions>
      <v-btn
        color="info"
        :text="$t('update.reload')"
        class="text-uppercase"
        @click="reloadPage"
        :append-icon="mdiRefreshCircle"
      />
    </template>

    <template v-slot:default>
      <div class="mr-1">{{ $t('update.updatedDate') }}:</div>
      <span> {{ codexState.remoteUpdated.toLocaleString() }}</span>
    </template>
  </v-banner>
</template>
