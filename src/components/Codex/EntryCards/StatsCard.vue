<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import StatChips from '../StatChips.vue'
import { isUndefined } from 'es-toolkit'

const entry: ComputedRef<CodexEntry> = inject('entry')!
</script>

<template>
  <v-card v-if="!isUndefined(entry.raw.stats)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ $t('meta.stats') }}
        </v-list-item-title>
      </template>
    </v-list-item>
    <v-card-text class="py-2">
      <StatChips :stats="entry.raw.stats"></StatChips>
    </v-card-text>
  </v-card>
</template>
