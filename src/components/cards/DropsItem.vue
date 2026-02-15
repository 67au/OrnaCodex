<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import MetaChips from '@/components/chips/MetaChips.vue'
import StatusListChips from '@/components/chips/StatusListChips.vue'
import StatsChips from '@/components/chips/StatsChips.vue'
import MaterialChips from '@/components/chips/MaterialChips.vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  material: {
    type: Boolean,
    default: false,
  },
  level: {
    type: String,
  },
})

const settings = useSettingsStore()
</script>

<template>
  <router-link :to="props.entry.url" class="text-decoration-none text-color-unset">
    <v-list-item density="compact" class="px-3" slim :ripple="false">
      <v-list-item-title>
        <span>
          {{ props.entry.name }}
        </span>
        <span v-if="props.level" class="pl-1">
          {{ `(${$t('units.level')} ${props.level})` }}
        </span>
      </v-list-item-title>
      <template v-slot:prepend>
        <v-avatar size="36" :rounded="false" class="mr-1">
          <v-img :src="props.entry.iconUrl" :class="props.entry.iconClass" />
        </v-avatar>
      </template>
      <div class="d-flex flex-wrap ga-1 py-1">
        <MetaChips :entry="props.entry" mini />
        <StatusListChips v-if="props.status" :entry="props.entry" mini />
        <MaterialChips
          v-if="props.material && settings.display.material && entry.upgrade_materials"
          :entry="entry"
        />
      </div>
    </v-list-item>
    <div
      v-if="settings.display.stats && entry.stats"
      class="mx-2 mb-1 d-flex flex-wrap pa-1 border-sm rounded-lg"
      style="width: fit-content"
    >
      <StatsChips :entry="entry" mini />
    </div>
  </router-link>
</template>
