<script setup lang="ts">
import config from '@/config'
import { codexStorage } from '@/storages'
import { useAppState } from '@/stores/app'
import { useCodexState } from '@/stores/codex'
import { mdiArrowUpCircleOutline, mdiUpdate } from '@mdi/js'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const codexState = useCodexState()
const appState = useAppState()
const { updateServiceWorker, needRefresh } = useRegisterSW()

async function reloadPage() {
  await updateServiceWorker(true)
  window.location.reload()
}

async function resetDatabase() {
  await codexStorage.clear()
  window.location.reload()
}
</script>

<template>
  <v-dialog :model-value="appState.isUpdating" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item :prepend-icon="mdiUpdate" title="Loading...">
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="primary" size="x-large"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="20"
            width="3"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>

  <v-container v-if="!appState.isUpdating">
    <v-sheet class="pa-4 text-center mx-auto w-100" rounded>
      <v-icon :icon="mdiArrowUpCircleOutline" color="info" class="mb-4" size="112"> </v-icon>
      <v-list-item>
        <v-list-item-title>
          <h2 class="text-h5 mb-4">
            {{ $t('update.version') }}
          </h2>
        </v-list-item-title>
      </v-list-item>

      <div class="d-flex flex-column ga-2 align-center">
        <v-progress-circular
          color="primary"
          indeterminate="disable-shrink"
          size="large"
          width="4"
        ></v-progress-circular>

        <v-list-item>
          <v-list-item-title>
            {{ `App Version: ${config.version}` }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            {{ `YACO Api Version: ${codexState.version}` }}
          </v-list-item-title>
        </v-list-item>

        <v-btn
          class="w-100 mt-4"
          size="large"
          max-width="300"
          color="success"
          @click="reloadPage"
          :disabled="!needRefresh || appState.isLoading"
        >
          {{ $t('update.refresh') }}
        </v-btn>

        <v-btn class="w-100 mt-4" size="large" max-width="300" color="error" @click="resetDatabase">
          {{ $t('update.reset') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>
