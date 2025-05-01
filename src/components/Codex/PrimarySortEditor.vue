<script setup lang="ts">
import config from '@/config'
import { useSortState } from '@/stores/sort'
import { mdiCloseCircle, mdiSort } from '@mdi/js'
import PrimarySortChip from './PrimarySortChip.vue'
import type { PrimarySortKeys } from '@/types/filters'

const dialog = shallowRef(false)

const sortState = useSortState()
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    opacity="0.1"
    scrollable
    :max-width="$vuetify.display.smAndDown ? undefined : 600"
    transition="fade-transition"
  >
    <template v-slot:activator="{ props: activator }">
      <PrimarySortChip
        :primary-sort="config.primarySort[sortState.primary as PrimarySortKeys]"
        :name="sortState.primary"
        v-bind="activator"
        :default-icon="mdiSort"
      >
      </PrimarySortChip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card density="compact">
        <v-toolbar density="compact">
          <v-toolbar-title>
            {{ $t('tools.primarySort') }}
          </v-toolbar-title>
          <template v-slot:append>
            <v-btn :icon="mdiCloseCircle" @click="isActive.value = false"></v-btn>
          </template>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-chip-group color="secondary" column v-model="sortState.primary">
            <template v-for="(value, key, index) in config.primarySort" :key="index">
              <PrimarySortChip
                :primary-sort="value"
                :name="key"
                @click="isActive.value = false"
              ></PrimarySortChip>
            </template>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
