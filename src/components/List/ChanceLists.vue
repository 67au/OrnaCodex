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
    <span v-if="item['chance'] !== undefined">
      <template v-if="$te(`meta.status.${item['name']}`)">
        {{ `${$t(`meta.status.${item['name']}`)} (${item['chance']})` }}
      </template>
      <template v-else>
        {{ `${$t(`meta.summons.${item['name']}`)} (${item['chance']})` }}
      </template>
    </span>
    <span v-else>
      {{ `${$t(`meta.status.${item['name']}`)}` }}
    </span>
  </var-cell>
</template>

<script lang="ts">
const codexState = useCodexState();

export default {
  props: {
    codex: {
      type: Object,
    },
  }
}
</script>