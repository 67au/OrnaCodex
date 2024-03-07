<script setup lang="ts">
import { global } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" border v-for="item, index in codex" :key="index">
    <template #icon>
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${item['icon']}`" />
    </template>
    <template v-if="item['tier'] !== undefined">
    {{ item['name'] }}
    <var-chip type="warning" size="small" :round="false" plain>
      {{ global.star + item['tier'] }}
    </var-chip>
    <br>
  </template>
    <span v-if="item['chance'] !== undefined">
      {{ `${item['name']} (${item['chance']})` }}
    </span>
    <span v-else>
      {{ `${item['name']}` }}
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