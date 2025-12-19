<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import MetaChips from './MetaChips.vue'
import StatChips from './StatChips.vue'
import MaterialChips from './MaterialChips.vue'
import { settingsStorage } from '@/storages/settings'
import { useSortState } from '@/stores/sort'

const sortState = useSortState()

defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})
</script>

<template>
  <router-link :to="entry.url" class="text-decoration-none" style="white-space: normal">
    <v-list-item>
      <v-list-item-title class="text-normal">{{ entry.name }}</v-list-item-title>
      <v-list-item-subtitle class="pt-1">
        <MetaChips :entry="entry" mini></MetaChips>
      </v-list-item-subtitle>
      <template v-slot:prepend>
        <v-avatar size="36" :rounded="false">
          <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
        </v-avatar>
      </template>
    </v-list-item>

    <template v-if="settingsStorage.displayStats && entry.raw.stats">
      <div style="width: fit-content" class="mx-2 px-1 py-1 border-sm rounded-lg">
        <StatChips :entry="entry" sorted mini></StatChips>
      </div>
    </template>
    <template v-else-if="sortState.isActive && entry.raw.stats?.[sortState.shortKey] !== undefined">
      <div style="width: fit-content" class="mx-2 px-1 py-1 border-sm rounded-lg">
        <StatChips :entry="entry" single mini></StatChips>
      </div>
    </template>

    <template v-if="settingsStorage.displayMaterial && entry.raw?.upgrade_materials">
      <v-sheet class="mx-2 my-1">
        <MaterialChips :entry="entry"></MaterialChips>
      </v-sheet>
    </template>
  </router-link>
  <v-divider class="mx-3 mt-1"></v-divider>
</template>
