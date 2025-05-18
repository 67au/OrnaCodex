<script setup lang="ts">
import { getIcon } from '@/plugins'
import type { Status } from '@/types/codex'
import { isUndefined } from 'es-toolkit'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

defineProps({
  color: {
    type: String,
  },
  statuses: {
    type: Object as PropType<Array<Status>>,
    required: true,
  },
  detailed: {
    type: Boolean,
    default: false,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    rounded: 'lg',
    variant: 'tonal',
    size: 'small',
    elevated: '1',
  },
}
</script>

<template>
  <v-defaults-provider :defaults="defaults" :disabled="!detailed">
    <template v-for="(status, index) in statuses" :key="index">
      <v-chip :color="color">
        <template v-if="detailed" v-slot:prepend>
          <v-avatar :rounded="false" class="mr-1">
            <v-img :src="getIcon('status', status.name)" class="image-render-pixel"></v-img>
          </v-avatar>
        </template>
        <template v-if="isUndefined(status.chance)">
          {{ `${$t('status.' + status.name)}` }}
        </template>
        <template v-else>
          {{ `${$t('status.' + status.name)} (${status.chance})` }}
        </template>
      </v-chip>
    </template>
  </v-defaults-provider>
</template>
