<script setup lang="ts">
import { global } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" v-for="item, index in codex" border :title="item['name']" :key="index"
    :description="item['description']">
    <template #icon>
      <template v-if="item['icon'] !== undefined">
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${item['icon']}`" />
    </template>
    </template>
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