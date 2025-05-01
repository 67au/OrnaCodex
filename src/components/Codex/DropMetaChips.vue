<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { getOptionName, getOptionValueName } from '@/plugins'
import {
  mdiAccountCheck,
  mdiCalendarStar,
  mdiDiamondStone,
  mdiDna,
  mdiFlask,
  mdiFolderOutline,
  mdiSwordCross,
  mdiTarget,
  mdiTshirtCrew,
} from '@mdi/js'
import StatusChips from './StatusChips.vue'
import config from '@/config'

defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: 'x-small',
    color: 'secondary',
  },
}
</script>

<template>
  <div class="d-flex flex-wrap ga-1 py-1">
    <v-defaults-provider :defaults="defaults">
      <v-chip color="warning" :text="entry.tierName"></v-chip>

      <v-chip
        color="warning"
        :prepend-icon="mdiFolderOutline"
        :text="getOptionValueName('category', entry.category)"
      ></v-chip>

      <v-chip v-if="entry.raw.exotic" color="tertiary" variant="tonal">
        <div class="exotic">{{ getOptionName('exotic') }}</div>
      </v-chip>

      <v-chip
        v-for="(event, index) in entry.raw.events"
        :key="index"
        :prepend-icon="mdiCalendarStar"
        color="amber"
        :text="getOptionValueName('events', event)"
      >
      </v-chip>

      <v-chip
        v-if="entry.raw.rarity"
        :prepend-icon="mdiDiamondStone"
        :color="entry.rarityTextColor"
        :text="getOptionValueName('rarity', entry.raw.rarity)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.family"
        :prepend-icon="mdiDna"
        :text="getOptionValueName('family', entry.raw.family)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.useable_by"
        :prepend-icon="mdiAccountCheck"
        :text="getOptionValueName('useable_by', entry.raw.useable_by)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.place"
        :prepend-icon="mdiTshirtCrew"
        :text="getOptionValueName('place', entry.raw.place)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.item_type"
        :prepend-icon="mdiFlask"
        :text="getOptionValueName('item_type', entry.raw.item_type)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.type"
        :prepend-icon="mdiSwordCross"
        :text="getOptionValueName('type', entry.raw.type)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.spell_type"
        :prepend-icon="entry.spellTypeIcon"
        :text="getOptionValueName('spell_type', entry.raw.spell_type)"
      ></v-chip>

      <v-chip
        v-if="entry.raw.targets"
        :prepend-icon="mdiTarget"
        :text="getOptionValueName('targets', entry.raw.targets)"
      ></v-chip>

      <StatusChips
        v-if="entry.raw.immunities"
        :color="config.statusColor.immunities"
        :statuses="entry.raw.immunities"
      ></StatusChips>
      <StatusChips
        v-if="entry.raw.cures"
        :color="config.statusColor.cures"
        :statuses="entry.raw.cures"
      ></StatusChips>
      <StatusChips
        v-if="entry.raw.causes"
        :color="config.statusColor.causes"
        :statuses="entry.raw.causes"
      ></StatusChips>
      <StatusChips
        v-if="entry.raw.gives"
        :color="config.statusColor.gives"
        :statuses="entry.raw.gives"
      ></StatusChips>
      <StatusChips v-if="entry.raw.summons" :statuses="entry.raw.summons"></StatusChips>
    </v-defaults-provider>
  </div>
</template>
