<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import MetaChips from './MetaChips.vue'
import StatChips from './StatChips.vue'
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
  <v-card color="teritary" variant="elevated" rounded="md">
    <router-link :to="entry.url" class="text-decoration-none" style="white-space: normal">
      <v-card-item>
        <v-card-title class="text-normal">{{ entry.name }}</v-card-title>
        <v-card-subtitle class="pt-1">
          <MetaChips :entry="entry"></MetaChips>
        </v-card-subtitle>
        <template v-slot:prepend>
          <v-avatar size="48" :rounded="false">
            <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
          </v-avatar>
        </template>
      </v-card-item>

      <template v-if="settingsStorage.displayStats && entry.raw.stats">
        <v-divider class="mx-3"></v-divider>
        <v-list-item class="py-2">
          <StatChips :stats="entry.raw.stats" sorted></StatChips>
        </v-list-item>
      </template>
      <template
        v-else-if="sortState.isActive && entry.raw.stats?.[sortState.shortKey] !== undefined"
      >
        <v-divider class="mx-3"></v-divider>
        <v-list-item class="py-2">
          <StatChips :stats="entry.raw.stats" single></StatChips>
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
