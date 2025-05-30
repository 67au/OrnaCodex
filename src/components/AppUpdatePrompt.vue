<script setup lang="ts">
import { useAppState } from '@/stores/app'
import { mdiArrowUpCircleOutline } from '@mdi/js'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const dialog = shallowRef(false)
const { needRefresh, updateServiceWorker } = useRegisterSW()
const appState = useAppState()
const show = computed(() => needRefresh.value || appState.updated)

async function reloadPage() {
  await updateServiceWorker(true)
  nextTick(() => setTimeout(() => window.location.reload(), 1000))
}
</script>

<template>
  <v-dialog v-model="dialog" close-on-back opacity="0.1" max-width="480">
    <template v-slot:activator="{ props: activator }">
      <v-fab-transition>
        <v-btn
          :icon="mdiArrowUpCircleOutline"
          v-bind="activator"
          v-show="show"
          @click="dialog = true"
        ></v-btn>
      </v-fab-transition>
    </template>

    <v-sheet class="pa-4 text-center mx-auto w-100" rounded="lg">
      <v-icon :icon="mdiArrowUpCircleOutline" color="info" class="mb-4" size="112"> </v-icon>
      <v-list-item>
        <v-list-item-title>
          <h2 class="text-h5 mb-4">
            {{ $t('update.title') }}
          </h2>
        </v-list-item-title>
      </v-list-item>
      <div class="d-flex flex-column ga-2 px-4">
        <v-btn block color="success" @click="reloadPage">
          {{ $t('update.refresh') }}
        </v-btn>
        <v-btn block color="error" @click="dialog = false">
          {{ $t('update.dismiss') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>
