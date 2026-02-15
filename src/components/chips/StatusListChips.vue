<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'

import StatusChips from './StatusChips.vue'
import config from '@/config'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  mini: {
    type: Boolean,
    defaults: false,
  },
})
</script>

<template>
  <StatusChips
    v-if="entry.immunities"
    :statuses="entry.immunities"
    :color="config.statusColor.immunities"
    :mini="props.mini"
  />
  <StatusChips
    v-if="entry.cures"
    :statuses="entry.cures"
    :color="config.statusColor.cures"
    :mini="props.mini"
  />
  <StatusChips
    v-if="entry.causes"
    :statuses="entry.causes"
    :color="config.statusColor.causes"
    :mini="props.mini"
  />
  <StatusChips
    v-if="entry.gives"
    :statuses="entry.gives"
    :color="config.statusColor.gives"
    :mini="props.mini"
  />
  <StatusChips
    v-if="entry.summons"
    :statuses="entry.summons"
    :color="config.statusColor.summons"
    :mini="props.mini"
  />
</template>
