<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { get, isUndefined } from 'es-toolkit/compat'
import StatusChips from '../StatusChips.vue'
import { mdiCircle } from '@mdi/js'
import config from '@/config'
import type { StatusName } from '@/types/codex'

const props = defineProps({
  name: {
    type: String as PropType<StatusName>,
    required: true,
  },
})

const entry: ComputedRef<CodexEntry> = inject('entry')!
const statuses = computed(() => get(entry.value.raw, props.name))
</script>

<template>
  <v-card v-if="!isUndefined(statuses)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ $t('meta.' + props.name) }}
        </v-list-item-title>
      </template>
      <template v-slot:append>
        <v-icon size="x-small" :icon="mdiCircle" :color="config.statusColor[props.name]"></v-icon>
      </template>
    </v-list-item>
    <v-card-text class="d-flex flex-wrap ga-1 py-2">
      <StatusChips :statuses="statuses" detailed></StatusChips>
    </v-card-text>
  </v-card>
</template>
