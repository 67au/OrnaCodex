<script setup lang="ts">
import { store, global } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" border v-for="item, index in codex" :key="index">
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${store.codex.icons[item['name']]}`" />
    </template>
    <template v-if="item['tier'] !== undefined">
    {{ item['name'] }}
    <var-chip type="warning" size="small" :round="false" plain>
      {{ global.star + item['tier'] }}
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
export default {
  props: {
    codex: {
      type: Object,
    },
  }
}
</script>