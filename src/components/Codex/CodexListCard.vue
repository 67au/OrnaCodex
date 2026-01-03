<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import MetaChips from './MetaChips.vue'
import StatChips from './StatChips.vue'
import MaterialChips from './MaterialChips.vue'
import { mdiOpenInNew, mdiShareVariant } from '@mdi/js'
import { settingsStorage } from '@/storages/settings'
import { useSortState } from '@/stores/sort'
import { useShare } from '@vueuse/core'
import OptionalBtns from './OptionalBtns.vue'

const sortState = useSortState()

defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

const { share, isSupported } = useShare()
function shareUrl(entry: CodexEntry) {
  share({
    title: entry.name,
    url: '/#' + entry.url,
  })
}
</script>

<template>
  <v-card density="compact" rounded="md">
    <router-link :to="entry.url" class="text-decoration-none" style="white-space: normal">
      <v-card-item class="py-1">
        <template v-slot:title>
          <div class="text-h6">{{ entry.name }}</div>
        </template>
        <v-card-title class="py-1">
          <MetaChips :entry="entry" mini></MetaChips>
        </v-card-title>
        <template v-slot:prepend>
          <v-avatar size="36" :rounded="false">
            <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
          </v-avatar>
        </template>
      </v-card-item>

      <template v-if="settingsStorage.displayStats && entry.raw.stats">
        <v-divider class="mx-3"></v-divider>
        <v-list-item class="py-1">
          <StatChips :entry="entry" sorted></StatChips>
        </v-list-item>
      </template>
      <template
        v-else-if="sortState.isActive && entry.raw.stats?.[sortState.shortKey] !== undefined"
      >
        <v-divider class="mx-3"></v-divider>
        <v-list-item class="py-1">
          <StatChips :entry="entry" single></StatChips>
        </v-list-item>
      </template>

      <template v-if="settingsStorage.displayMaterial && entry.raw?.upgrade_materials">
        <v-divider class="mx-3"></v-divider>
        <v-list-item density="compact" class="my-0">
          <MaterialChips :entry="entry"></MaterialChips>
        </v-list-item>
      </template>
    </router-link>

    <v-list-item class="bg-surface-light">
      <template v-slot:append>
        <v-list-item-action class="ga-1">
          <OptionalBtns :entry="entry" size="small"></OptionalBtns>
          <v-btn
            v-if="isSupported"
            size="small"
            :icon="mdiShareVariant"
            variant="text"
            color="secondary"
            @click="shareUrl(entry)"
          ></v-btn>
          <v-btn
            size="small"
            :icon="mdiOpenInNew"
            variant="text"
            color="secondary"
            :href="entry.ornaUrl"
            target="_blank"
          ></v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-card>
</template>
