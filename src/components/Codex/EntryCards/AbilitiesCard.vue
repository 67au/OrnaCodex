<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { isUndefined } from 'es-toolkit'
import config from '@/config'

const entry: ComputedRef<CodexEntry> = inject('entry')!
</script>

<template>
  <template v-if="!isUndefined(entry.raw.abilities)">
    <v-card>
      <v-list-item class="bg-surface-light" density="compact">
        <template v-slot:title>
          <v-list-item-title>
            {{ $t('meta.abilities') }}
          </v-list-item-title>
        </template>
      </v-list-item>
      <template v-for="(ability, index) in entry.passiveAbilities" :key="index">
        <v-divider v-if="index !== 0" class="mx-3"></v-divider>
        <v-list-item class="py-1">
          <template v-slot:prepend>
            <v-avatar size="36" :rounded="false">
              <v-img :src="config.ornaStaticUrl + ability?.icon" class="image-render-pixel"></v-img>
            </v-avatar>
          </template>
          <template v-slot:title>
            {{ ability?.name }}
          </template>
          <template v-slot:subtitle>
            <v-list-item-subtitle>
              {{ ability?.description }}
            </v-list-item-subtitle>
          </template>
        </v-list-item>
      </template>
    </v-card>
  </template>
</template>
