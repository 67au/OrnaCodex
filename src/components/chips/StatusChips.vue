<script setup lang="ts">
import type { Status } from '@/types/codex'

import { getIcon } from '@/utils'
import { isUndefined } from 'es-toolkit'
import type { PropType } from 'vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const props = defineProps({
  statuses: {
    type: Object as PropType<Array<Status>>,
    required: true,
  },
  color: {
    type: String,
  },
  mini: {
    type: Boolean,
    default: false,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: props.mini ? 'x-small' : 'small',
    rounded: props.mini ? 'sm' : 'lg',
    color: 'default',
  },
}
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <v-chip v-for="status in props.statuses" :key="status.name" :color="props.color">
      <template v-if="!props.mini" v-slot:prepend>
        <v-avatar :rounded="false" class="mr-1">
          <v-img :src="getIcon('status', status.name)" class="image-render-pixel" />
        </v-avatar>
      </template>
      <template v-slot:default>
        <span>{{ $t('status.' + status.name) }}</span>
      </template>
      <template v-if="!isUndefined(status.chance)" v-slot:append>
        <span class="ml-1">{{ `(${status.chance}%)` }}</span>
      </template>
    </v-chip>
  </v-defaults-provider>
</template>
