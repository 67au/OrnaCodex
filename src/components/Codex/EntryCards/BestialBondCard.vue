<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { isUndefined } from 'es-toolkit'
import AbilityChip from '../AbilityChip.vue'

const entry: ComputedRef<CodexEntry> = inject('entry')!
</script>

<template>
  <v-card v-if="!isUndefined(entry.raw.bestial_bond)">
    <v-list-item class="bg-surface-light" density="compact">
      <template v-slot:title>
        <v-list-item-title>
          {{ $t('meta.bestial_bond') }}
        </v-list-item-title>
      </template>
    </v-list-item>
    <template v-for="(bonds, index) in entry.raw.bestial_bond" :key="index">
      <v-list-item class="my-1">
        <template v-slot:title>
          {{ `${$t('units.level')} ${index + 1}` }}
        </template>
        <template v-slot:subtitle>
          <div class="pt-1 d-flex flex-wrap ga-1">
            <template v-for="(bond, index) in bonds" :key="index">
              <AbilityChip v-if="bond.type === 'ABILITY'" :name="bond.name"></AbilityChip>
              <v-chip size="small" rounded="lg" color="secondary" v-else>
                <template v-if="bond.type === 'BOND'">
                  {{ `${$t('bestial_bond.' + bond.name)} (${bond.chance})` }}
                </template>
                <template v-else-if="bond.type === 'BONUS'">
                  {{ `${$t('bestial_bond.' + bond.name)}: ${bond.value}` }}
                </template>
                <template v-else-if="bond.type === 'BUFF'">
                  {{ `+${$t('bestial_bond.' + bond.name)}` }}
                </template>
              </v-chip>
            </template>
          </div>
        </template>
      </v-list-item>
    </template>
  </v-card>
</template>
