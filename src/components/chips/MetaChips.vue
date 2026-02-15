<script setup lang="ts">
import { getOptionName, getOptionValueName } from '@/utils'
import type { CodexEntry } from '@/utils/codex'
import {
  mdiAccountCheck,
  mdiCalendarStarOutline,
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
import DetailMetaChip from './DetailMetaChip.vue'
import colors from '@/styles/colors.module.scss'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  slim: {
    type: Boolean,
    default: false,
  },
  mini: {
    type: Boolean,
    defaults: false,
  },
})

const defaults: DefaultsOptions = {
  VChip: {
    variant: 'tonal',
    size: props.mini ? 'x-small' : 'small',
    rounded: props.mini ? 'sm' : 'lg',
    color: 'tertiary',
  },
}
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <template v-if="!props.slim">
      <v-chip color="amber" :text="props.entry.tierName" />

      <v-chip
        color="amber"
        :prepend-icon="mdiFolderOutline"
        :text="getOptionValueName('category', props.entry.category)"
      />

      <v-chip v-if="props.entry.exotic === 1" color="blue-grey">
        <span class="exotic">
          {{ getOptionName('exotic') }}
        </span>
      </v-chip>
    </template>

    <v-chip
      v-if="props.entry.rarity"
      :text="getOptionValueName('rarity', props.entry.rarity)"
      :color="props.entry.rarityTextColor"
    />

    <!-- raids hp -->
    <v-chip
      v-if="entry.hp"
      color="red-lighten-3"
      :prepend-icon="mdiHeart"
      :text="entry.hp.toLocaleString()"
    />

    <v-chip
      v-for="event in props.entry.events"
      :key="event"
      :color="colors['event-text']"
      :prepend-icon="mdiCalendarStarOutline"
    >
      {{ getOptionValueName('events', event) }}
    </v-chip>

    <DetailMetaChip
      v-if="props.entry.family"
      name="family"
      :value="props.entry.family"
      :icon="mdiDna"
    />

    <DetailMetaChip
      v-if="props.entry.useable_by"
      name="useable_by"
      :value="props.entry.useable_by"
      :icon="mdiAccountCheck"
    />

    <DetailMetaChip
      v-if="props.entry.place"
      name="place"
      :value="props.entry.place"
      :icon="mdiTshirtCrew"
    />

    <DetailMetaChip
      v-if="props.entry.item_type"
      name="item_type"
      :value="props.entry.item_type"
      :icon="mdiFlask"
    />

    <DetailMetaChip
      v-if="props.entry.type"
      name="type"
      :value="props.entry.type"
      :icon="mdiSwordCross"
    />

    <v-chip
      v-if="entry.spell_type"
      :prepend-icon="entry.spellTypeIcon"
      :text="getOptionValueName('spell_type', entry.spell_type)"
    />

    <DetailMetaChip
      v-if="props.entry.targets"
      name="targets"
      :value="props.entry.targets"
      :icon="mdiTarget"
    />

    <v-chip
      v-for="(tag, index) in entry.tags"
      :key="index"
      :prepend-icon="mdiTag"
      :text="getOptionValueName('tags', tag)"
    />
  </v-defaults-provider>
</template>
