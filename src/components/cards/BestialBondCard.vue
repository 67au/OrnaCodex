<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import EntryChip from '../chips/EntryChip.vue'
import { getAttachedAbilityKey, getStatValueName } from '@/utils'

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: 'small',
    rounded: 'lg',
    color: 'default',
  },
}

const entry = inject<ComputedRef<CodexEntry>>('entry')
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <DetailCard v-if="entry?.bestial_bond" :title="$t('meta.bestial_bond')">
      <template v-slot:default>
        <div class="pb-2">
          <template v-for="(bonds, index) in entry.bestial_bond" :key="index">
            <div class="pt-1">
              <div class="px-4 text-title-medium">
                {{ $t('units.level') + ' ' + (index + 1) }}
              </div>
              <div class="pa-2 d-flex flex-wrap ga-1">
                <template v-for="(bond, index) in bonds" :key="index">
                  <EntryChip
                    v-if="bond.type === 'ABILITY'"
                    :entry-key="getAttachedAbilityKey(bond.name)"
                  />
                  <v-chip v-else-if="bond.type === 'BOND'" :text="$t('status.' + bond.name)">
                    <template v-slot:append>
                      <span class="pl-1">{{ `(${bond.value}%)` }}</span>
                    </template>
                  </v-chip>
                  <v-chip v-else-if="bond.type === 'BONUS'">
                    <template v-if="typeof bond.value === 'boolean'">
                      {{ $t('stats.' + bond.name) }}
                    </template>
                    <template v-else>
                      {{
                        `${$t('stats.' + bond.name)}: ${getStatValueName(bond.name, bond.value)}`
                      }}
                    </template>
                  </v-chip>
                </template>
              </div>
            </div>
            <v-divider class="mx-3" />
          </template>
        </div>
      </template>
    </DetailCard>
  </v-defaults-provider>
</template>
