<script setup lang="ts">
import { global, useCodexState } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" border v-for="item, index in codex" :key="index">
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="global.getStaticUrl(codexState.icons[item['name']])" />
    </template>
    <template v-if="item['tier'] !== undefined">
      {{ item['name'] }}
      <var-chip type="warning" size="small" :round="false" plain>
        {{ global.getTier(item['tier']) }}
      </var-chip>
      <br>
    </template>
    <template v-if="summons">
      {{ `${$t(`meta.summons.${item['name']}`)} (${item['chance']})` }}
    </template>
    <template v-else>
      <span v-if="item['chance'] !== undefined">
        {{ `${$t(`meta.status.${item['name']}`)} (${item['chance']})` }}
      </span>
      <span v-else>
        {{ `${$t(`meta.status.${item['name']}`)}` }}
      </span>
    </template>
  </var-cell>
</template>

<script lang="ts">
const codexState = useCodexState();

export default {
  props: {
    codex: {
      type: Object,
    },
    summons: {
      type: Boolean,
      default: false,
    }
  }
}
</script>