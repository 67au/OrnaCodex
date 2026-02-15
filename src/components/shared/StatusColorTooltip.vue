<script setup lang="ts">
import config from '@/config'
import type { StatusKey } from '@/types/codex'
import { getOptionName } from '@/utils'
import { mdiCircle } from '@mdi/js'

const props = defineProps({
  name: {
    type: String as PropType<StatusKey>,
    required: true,
  },
})

const statusKey: Array<StatusKey> = ['immunities', 'causes', 'cures', 'gives', 'summons']
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props: activator }">
      <v-icon
        v-bind="activator"
        :icon="mdiCircle"
        size="small"
        :color="config.statusColor[props.name]"
      />
    </template>

    <v-card :title="$t('helper.tooltip.status')">
      <v-card-text class="d-flex ga-1">
        <v-chip
          v-for="name in statusKey"
          size="small"
          :color="config.statusColor[name]"
          :text="getOptionName(name)"
          :key="name"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>
