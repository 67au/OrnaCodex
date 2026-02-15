<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import { getIcon, getStatName, getStatValueName } from '@/utils'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { isArray } from 'es-toolkit/compat'
import type { Status } from '@/types/codex'
import { i18n } from '@/i18n'

const entry = inject<ComputedRef<CodexEntry>>('entry')

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'text',
    size: 'x-small',
    rounded: 'sm',
    color: 'default',
  },
}

function toStatusStatText(statValue: Array<Status>) {
  return statValue.map((s ) => `${i18n.global.t('status.' + s.name)} (${s.chance}%)`).join(', ')
}
</script>

<template>
  <DetailCard v-if="entry?.abilities" :title="$t('meta.abilities')">
    <template v-slot:default>
      <div class="pb-2">
        <template v-for="[key, ability] in entry.abilitiesArray" :key="key">
          <v-list-item class="px-3" :title="ability.name" :ripple="false" slim>
            <template v-slot:prepend>
              <v-avatar size="36" :rounded="false" class="mr-1">
                <v-img :src="getIcon('status', key)" class="image-render-pixel" />
              </v-avatar>
            </template>
            <template v-slot:subtitle v-if="ability.description">
              <v-list-item-subtitle> {{ ability.description }} </v-list-item-subtitle>
            </template>
          </v-list-item>
          <div
            v-if="ability.stats"
            class="mx-2 ma-1 d-flex flex-wrap pa-1 border-sm rounded-lg"
            style="width: fit-content"
          >
            <v-defaults-provider :defaults="defaults">
              <template v-for="(value, key) in ability.stats" :key="key">
                <v-chip v-if="typeof value === 'number' || typeof value === 'string'">
                  <template v-slot:prepend>
                    <span class="pr-1">{{ getStatName(key) + ':' }}</span>
                  </template>
                  {{ getStatValueName('abilities.' + key, value) }}
                </v-chip>
                <v-chip v-else-if="typeof value === 'boolean'">
                  {{ getStatName(key) }}
                </v-chip>
                <v-chip v-else-if="isArray(value)">
                  <template v-slot:prepend>
                    <span class="pr-1">{{ getStatName(key) + ':' }}</span>
                  </template>
                  {{ toStatusStatText(value as Array<Status>) }}
                </v-chip>
              </template>
            </v-defaults-provider>
          </div>
          <v-divider class="mx-3" />
        </template>
      </div>
    </template>
  </DetailCard>
</template>
