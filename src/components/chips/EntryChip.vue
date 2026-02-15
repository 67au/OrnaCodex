<script setup lang="ts">
import type { CodexEntryKey } from '@/types/codex'
import { getCodexEntryByKey } from '@/utils/codex'
import type { PropType } from 'vue'

const props = defineProps({
  entryKey: {
    type: Object as PropType<CodexEntryKey | string>,
    required: true,
  },
  prependIcon: {
    type: String,
  },
})

const entry = getCodexEntryByKey(props.entryKey)
</script>

<template>
  <v-chip v-if="entry" variant="flat" color="secondary" :to="entry.url" :text="entry.name" />
  <v-chip v-else variant="flat" color="secondary" :text="props.entryKey" />
</template>
