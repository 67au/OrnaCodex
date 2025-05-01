<script setup lang="ts">
import { CodexEntryFactory } from '@/plugins/codex'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const entry = CodexEntryFactory.getEntry('spells', props.name)
</script>

<template>
  <v-chip
    size="small"
    rounded="lg"
    variant="flat"
    color="primary"
    :to="entry.url"
    :text="entry.name"
    :prepend-icon="entry.spellTypeIcon"
  >
  </v-chip>
</template>
