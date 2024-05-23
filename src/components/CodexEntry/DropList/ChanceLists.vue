<script setup lang="ts">
import { getStaticUrl, getTierName } from '@/plugins/utils';
import { useCodexState } from '@/stores';
</script>

<template>
  <var-cell class="text-cell" v-for="entry, index in entries" :title="entry.name" :key="index"
    :description="entry.description" border>
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="getStaticUrl(codexState.icons[entry.name])" />
    </template>
    <template v-if="entry.tier !== undefined">
      {{ entry.name }}
      <var-chip type="warning" size="small" :round="false" plain>
        {{ getTierName(entry.tier) }}
      </var-chip>
      <br>
    </template>
    <template v-if="summons">
      {{ `${$t(`meta.summons.${entry.name}`)} (${entry.chance})` }}
    </template>
    <template v-else>
      <span v-if="entry.chance !== undefined">
        {{ `${$t(`meta.status.${entry.name}`)} (${entry.chance})` }}
      </span>
      <span v-else>
        {{ `${$t(`meta.status.${entry.name}`)}` }}
      </span>
    </template>
  </var-cell>
</template>

<script lang="ts">
export default {
  props: {
    entries: {
      type: Object,
    },
    summons: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    codexState() {
      return useCodexState()
    }
  }
}
</script>