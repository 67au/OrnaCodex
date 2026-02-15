<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import { getOptionName, getOptionValueName } from '@/utils'
import type { PropType } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String as PropType<string | number>,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
})

const settings = useSettingsStore()
</script>

<template>
  <v-chip :color="props.color" :prepend-icon="props.icon">
    <template v-slot:prepend v-if="settings.display.detail">
      <span class="pr-1"> {{ getOptionName(name) + ': ' }} </span>
    </template>
    {{ getOptionValueName(props.name, props.value) }}
  </v-chip>
</template>
