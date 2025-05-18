<script setup lang="ts">
import AppBackTop from '@/components/AppBackTop.vue'
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import AbilitiesCard from '@/components/Codex/EntryCards/AbilitiesCard.vue'
import AbilityCard from '@/components/Codex/EntryCards/AbilityCard.vue'
import BestialBondCard from '@/components/Codex/EntryCards/BestialBondCard.vue'
import DropsCard from '@/components/Codex/EntryCards/DropsCard.vue'
import EnemyCard from '@/components/Codex/EntryCards/EnemyCard.vue'
import MainCard from '@/components/Codex/EntryCards/MainCard.vue'
import StatsCard from '@/components/Codex/EntryCards/StatsCard.vue'
import StatusesCard from '@/components/Codex/EntryCards/StatusesCard.vue'
import OptionalBtns from '@/components/Codex/OptionalBtns.vue'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { CodexEntryFactory } from '@/plugins/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

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

const entry = computed(() => CodexEntryFactory.getEntry(props.category, props.id))

provide('entry', entry)

const defaults: DefaultsOptions = {
  VCard: {
    variant: 'elevated',
    rounded: 'md',
    density: 'compact',
  },
}
</script>

<template>
  <DefaultLayout :title="$t('title')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <template v-slot:tools>
      <AppBackTop></AppBackTop>
    </template>
    <v-defaults-provider :defaults="defaults">
      <v-container
        fluid
        :class="{
          'px-2': true,
          masonry: $vuetify.display.mdAndUp,
          'card d-flex flex-column ga-2': !$vuetify.display.mdAndUp,
        }"
      >
        <MainCard>
          <template v-slot:actions>
            <OptionalBtns :entry="entry"></OptionalBtns>
          </template>
        </MainCard>

        <StatsCard></StatsCard>
        <AbilityCard></AbilityCard>
        <AbilitiesCard></AbilitiesCard>

        <EnemyCard></EnemyCard>

        <StatusesCard name="causes"></StatusesCard>
        <StatusesCard name="gives"></StatusesCard>
        <StatusesCard name="cures"></StatusesCard>
        <StatusesCard name="immunities"></StatusesCard>
        <StatusesCard name="summons"></StatusesCard>

        <DropsCard name="skills"></DropsCard>
        <DropsCard name="dropped_by"></DropsCard>
        <DropsCard name="drops"></DropsCard>
        <DropsCard name="upgrade_materials"></DropsCard>
        <DropsCard name="learned_by"></DropsCard>
        <DropsCard name="requirements"></DropsCard>
        <DropsCard name="celestial_classes"></DropsCard>

        <DropsCard name="used_by"></DropsCard>
        <DropsCard name="off-hands"></DropsCard>
        <DropsCard name="sources"></DropsCard>

        <BestialBondCard></BestialBondCard>
      </v-container>
    </v-defaults-provider>
  </DefaultLayout>
</template>

<style>
.masonry {
  column-count: 2;
  column-gap: 8px;
  max-width: 1200px;
}

.masonry > * {
  margin-bottom: 8px;
}

.card {
  max-width: 600px;
}
</style>
