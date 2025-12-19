<script setup lang="ts">
import { CodexEntryFactory, type CodexEntry } from '@/plugins/codex'
import { get, isArray, isUndefined } from 'es-toolkit/compat'
import DropMetaChips from '../DropMetaChips.vue'
import StatChips from '../StatChips.vue'
import MaterialChips from '../MaterialChips.vue'
import { settingsStorage } from '@/storages/settings'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const entry: ComputedRef<CodexEntry> = inject('entry')!
const drops = computed(() => get(entry.value.raw, props.name) as Array<[string, string]>)
const dropsEntry = computed(() => {
  if (isArray(drops.value)) {
    return drops.value.map(([category, id]) => CodexEntryFactory.getEntry(category, id))
  } else {
    return []
  }
})
</script>

<template>
  <v-card v-if="!isUndefined(drops)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ $t('meta.' + name) }}
        </v-list-item-title>
      </template>
    </v-list-item>
    <template v-for="(drop, index) in dropsEntry" :key="drop.id">
      <v-divider v-if="index !== 0" class="mx-4"></v-divider>
      <router-link :to="drop.url" class="text-decoration-none">
        <v-list-item class="py-1">
          <template v-slot:prepend>
            <v-avatar size="36" :rounded="false">
              <v-img :src="drop.iconUrl" :class="drop.iconClass"></v-img>
            </v-avatar>
          </template>
          <template v-slot:title>
            {{ drop.name }}
          </template>
          <template v-slot:subtitle>
            <DropMetaChips :entry="drop"></DropMetaChips>
          </template>

          <template v-if="settingsStorage.displayStats && drop.raw.stats">
            <v-sheet border="sm" rounded="lg" class="pa-1 my-1" style="width: fit-content">
              <StatChips :entry="drop" mini></StatChips>
            </v-sheet>
          </template>

          <template v-if="settingsStorage.displayMaterial && drop.raw?.upgrade_materials">
            <v-sheet class="my-1">
              <MaterialChips :entry="drop"></MaterialChips>
            </v-sheet>
          </template>
        </v-list-item>
      </router-link>
    </template>
  </v-card>
</template>
