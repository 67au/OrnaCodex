<script setup lang="ts">
import { getOptionName, getOptionValueName } from '@/plugins'
import type { CodexEntry } from '@/plugins/codex'
import {
  mdiAccountCheck,
  mdiCalendarStar,
  mdiDiamondStone,
  mdiDna,
  mdiFlask,
  mdiFolderOutline,
  mdiHeart,
  mdiSwordCross,
  mdiTag,
  mdiTarget,
  mdiTshirtCrew,
} from '@mdi/js'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  mini: {
    type: Boolean,
    default: false,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: props.mini ? 'x-small' : 'small',
    rounded: props.mini ? 'sm' : 'lg',
    color: 'secondary',
  },
}
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <div class="d-flex flex-wrap ga-1">
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

      <v-chip
        v-if="entry.raw.hp"
        color="red-lighten-3"
        :prepend-icon="mdiHeart"
        :text="entry.raw.hp.toLocaleString()"
      ></v-chip>

      <v-chip
        v-for="(tag, index) in entry.raw.tags"
        :key="index"
        :prepend-icon="mdiTag"
        :text="getOptionValueName('tags', tag)"
      ></v-chip>
    </div>
  </v-defaults-provider>
</template>
