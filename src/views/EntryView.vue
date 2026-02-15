<script setup lang="ts">
import { getCodexEntryById } from '@/utils/codex'
import { isUndefined } from 'es-toolkit'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

import MainCard from '@/components/cards/MainCard.vue'
import StatsCard from '@/components/cards/StatsCard.vue'
import OffhandAbilityCard from '@/components/cards/OffhandAbilityCard.vue'
import AbilitiesCard from '@/components/cards/AbilitiesCard.vue'
import StatusCard from '@/components/cards/StatusCard.vue'
import DropsCard from '@/components/cards/DropsCard.vue'
import BestialBondCard from '@/components/cards/BestialBondCard.vue'
import EnemyCard from '@/components/cards/EnemyCard.vue'
import { mdiBookSearch, mdiExport } from '@mdi/js'

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

const defaults: DefaultsOptions = {
  VCard: {
    variant: 'elevated',
    rounded: 'md',
    density: 'compact',
  },
}

const entry = computed(() => getCodexEntryById([props.category, props.id]))
provide('entry', entry)
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <template v-if="isUndefined(entry)">
      <v-container class="pa-2">
        <v-sheet class="rounded-lg mx-auto" max-width="600">
          <v-empty-state
            justify="center"
            :icon="mdiBookSearch"
            :headline="$t('helper.pageNotFound')"
          >
            <template v-slot:actions>
              <v-btn
                size="large"
                color="secondary"
                rounded="lg"
                variant="tonal"
                :to="{ name: 'home' }"
                :text="$t('title')"
                :append-icon="mdiExport"
              />
            </template>
          </v-empty-state>
        </v-sheet>
      </v-container>
    </template>
    <template v-else>
      <v-container
        fluid
        :class="{
          'pa-2': true,
          masonry: $vuetify.display.mdAndUp,
          'd-flex flex-column ga-2': !$vuetify.display.mdAndUp,
        }"
      >
        <MainCard />

        <EnemyCard />

        <OffhandAbilityCard />
        <AbilitiesCard />
        <StatsCard />

        <StatusCard name="immunities" />
        <StatusCard name="cures" />
        <StatusCard name="causes" />
        <StatusCard name="gives" />
        <StatusCard name="summons" />

        <DropsCard name="skills" />
        <DropsCard name="dropped_by" />
        <DropsCard name="drops" />
        <DropsCard name="upgrade_materials" />
        <DropsCard name="learned_by" />
        <DropsCard name="requirements" />
        <DropsCard name="celestial_classes" />

        <DropsCard name="used_by" />
        <DropsCard name="off_hands" />
        <DropsCard name="dismantled_by" />

        <BestialBondCard />
      </v-container>
    </template>
  </v-defaults-provider>
</template>

<style lang="css" scoped>
.masonry {
  column-count: 2;
  column-gap: 8px;
  max-width: 1200px;
}

.masonry > * {
  margin-bottom: 8px;
}
</style>
