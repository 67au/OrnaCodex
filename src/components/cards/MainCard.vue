<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js'

import MetaChips from '@/components/chips/MetaChips.vue'
import { getIcon } from '@/utils'
import type { CodexEntry } from '@/utils/codex'
import ActionButtons from '@/components/btns/ActionButtons.vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const entry = inject<ComputedRef<CodexEntry>>('entry')

const defaults: DefaultsOptions = {
  VBtn: {
    variant: 'text',
    color: 'secondary',
  },
}
</script>

<template>
  <v-card class="rounded-lg border-md border-secondary" v-if="entry">
    <v-card-item>
      <v-card-title class="text-title-large text-normal">{{ entry.name }}</v-card-title>
      <div class="d-flex flex-wrap ga-1 pt-2">
        <MetaChips :entry="entry"></MetaChips>
      </div>
      <template v-slot:prepend>
        <v-avatar size="72" :rounded="false">
          <v-img :src="entry.iconUrl" :class="entry.iconClass" />
        </v-avatar>
      </template>
    </v-card-item>

    <template v-if="entry.follower">
      <v-divider class="mx-3"></v-divider>
      <v-list-item slim>
        <template v-slot:prepend>
          <v-avatar size="36" :rounded="false" class="mr-2">
            <v-img :src="getIcon('status', entry.follower)" class="image-render-pixel" />
          </v-avatar>
        </template>
        <template v-slot:title>
          <v-list-item-subtitle class="text-surface-variant">
            {{ $t('meta.follower') }}
          </v-list-item-subtitle>
        </template>
        <template v-slot:subtitle>
          <v-list-item-title>
            {{ $t('follower.' + entry.follower) }}
          </v-list-item-title>
        </template>
      </v-list-item>
    </template>

    <template v-if="entry.description">
      <v-divider class="mx-3"></v-divider>
      <v-card-text class="text-surface-variant text-pre-wrap">
        {{ entry.description }}
      </v-card-text>
    </template>

    <v-divider class="mx-3"></v-divider>
    <v-defaults-provider :defaults="defaults">
      <v-list-item class="px-2" slim>
        <template v-slot:prepend>
          <ActionButtons :entry="entry" />
        </template>
        <template v-slot:append>
          <v-btn :icon="mdiOpenInNew" :href="entry.ornaUrl" target="_blank" />
        </template>
      </v-list-item>
    </v-defaults-provider>
  </v-card>
</template>
