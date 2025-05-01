<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { useFiltersState } from '@/stores/filters'
import type { CodexEntryKeys } from '@/types/filters'
import { mdiCloseCircle, mdiDelete } from '@mdi/js'

const dialog = shallowRef(false)

const codexState = useCodexState()
const filtersState = useFiltersState()
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    opacity="0.1"
    scrollable
    :max-width="$vuetify.display.smAndDown ? undefined : 600"
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card density="compact">
        <v-toolbar density="compact">
          <v-toolbar-title>{{ $t('tools.filters') }} </v-toolbar-title>
          <template v-slot:append>
            <v-btn :icon="mdiDelete" @click="filtersState.$reset"></v-btn>
            <v-btn :icon="mdiCloseCircle" @click="isActive.value = false"></v-btn>
          </template>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-chip-group color="secondary" :model-value="filtersState.keys" column multiple>
            <v-chip
              v-for="(_, key, index) in codexState.options"
              rounded="lg"
              variant="tonal"
              :key="index"
              :value="key"
              :text="$t('meta.' + key)"
              @click="filtersState.setFilter(key as CodexEntryKeys)"
            >
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
