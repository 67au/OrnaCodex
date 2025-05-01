<script setup lang="ts">
import type { PrimarySortKeys } from '@/types/filters'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'

defineProps({
  name: {
    type: String as PropType<PrimarySortKeys>,
    required: true,
  },
  primarySort: {
    type: Object as PropType<{
      key: string
      asc: boolean | undefined
    }>,
    required: true,
  },
  defaultIcon: {
    type: String,
  },
})
</script>

<template>
  <v-chip
    rounded="lg"
    variant="tonal"
    color="secondary"
    :prepend-icon="primarySort.asc === undefined ? defaultIcon : undefined"
    :value="name"
    :text="$t('sort.primary.' + primarySort.key)"
  >
    <template v-slot:append v-if="primarySort.asc !== undefined">
      <v-icon v-if="primarySort.asc" :icon="mdiArrowDown"></v-icon>
      <v-icon v-else :icon="mdiArrowUp"></v-icon>
    </template>
  </v-chip>
</template>
