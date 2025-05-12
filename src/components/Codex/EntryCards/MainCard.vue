<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { mdiOpenInNew } from '@mdi/js'

import MetaChips from '../MetaChips.vue'

const entry = inject('entry') as CodexEntry
</script>

<template>
  <v-card border="md">
    <v-card-item>
      <v-card-title style="white-space: normal">{{ entry.name }}</v-card-title>
      <v-card-subtitle class="pt-2">
        <MetaChips :entry="entry"></MetaChips>
      </v-card-subtitle>
      <template v-slot:prepend>
        <v-avatar size="72" :rounded="false">
          <v-img :src="entry.iconUrl" :class="entry.iconClass"></v-img>
        </v-avatar>
      </template>
    </v-card-item>
    <template v-if="entry.description">
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="text-surface-variant">
        {{ entry.description }}
      </v-card-text>
    </template>

    <v-divider class="mx-4"></v-divider>
    <v-list-item>
      <template v-slot:prepend>
        <v-list-item-action class="ga-1">
          <slot name="actions"></slot>
        </v-list-item-action>
      </template>
      <template v-slot:append>
        <v-list-item-action class="ga-1">
          <v-btn
            :icon="mdiOpenInNew"
            variant="text"
            color="secondary"
            :href="entry.ornaUrl"
            target="_blank"
          ></v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-card>
</template>
