<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { isUndefined } from 'es-toolkit'
import DropMetaChips from '../DropMetaChips.vue'

const entry: ComputedRef<CodexEntry> = inject('entry')!
</script>

<template>
  <v-card v-if="!isUndefined(entry.raw.ability)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ $t('meta.ability') }}
        </v-list-item-title>
      </template>
    </v-list-item>
    <router-link :to="entry.abilityEntry.url" class="text-decoration-none">
      <v-list-item class="py-1">
        <template v-slot:prepend>
          <v-avatar size="36" :rounded="false">
            <v-img :src="entry.abilityEntry.iconUrl" :class="entry.abilityEntry.iconClass"></v-img>
          </v-avatar>
        </template>
        <template v-slot:title>
          {{ entry.abilityEntry.name }}
        </template>
        <template v-slot:subtitle>
          <DropMetaChips :entry="entry.abilityEntry"></DropMetaChips>
        </template>
      </v-list-item>
    </router-link>
  </v-card>
</template>
