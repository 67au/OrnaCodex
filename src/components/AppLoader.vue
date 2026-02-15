<script setup lang="ts">
import { useAppState } from '@/stores/app'
import { mdiUpdate } from '@mdi/js'

const appState = useAppState()

onMounted(async () => {
  await appState.initialize()
})

const { state } = storeToRefs(appState)

const loadingTitle = computed(() => {
  switch (state.value) {
    case 'LOADING':
      return 'Loading...'
    case 'UPDATE':
      return 'Updating...'
    case 'FAILED':
      return 'Failed'
    default:
      return ''
  }
})
</script>

<template>
  <template v-if="state === 'FINISHED'">
    <slot></slot>
  </template>
  <template v-else-if="state === 'FAILED'">
    <div class="text-title-medium">
      {{ loadingTitle }}
    </div>
  </template>
  <template v-else>
    <v-dialog :model-value="state !== undefined" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="8" rounded="lg">
        <v-list-item :title="loadingTitle">
          <template v-slot:prepend>
            <v-icon :icon="mdiUpdate" color="secondary" size="x-large"></v-icon>
          </template>
          <template v-slot:append>
            <v-progress-circular
              color="secondary"
              indeterminate="disable-shrink"
              size="20"
              width="3"
            ></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
  </template>
</template>
