<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    size: 'x-small',
    color: 'grey-darken-3',
    variant: 'flat',
  },
}
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <template v-for="material in props.entry.upgradeMaterialsArray" :key="material.key">
      <v-chip :text="material.name">
        <template v-slot:prepend>
          <v-avatar :rounded="false" class="mr-1">
            <v-img :src="material.iconUrl" :class="material.iconClass" />
          </v-avatar>
        </template>
      </v-chip>
    </template>
  </v-defaults-provider>
</template>
