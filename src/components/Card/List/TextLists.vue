<script setup>
import { global } from '@/store';
</script>

<template>
  <var-cell class="codex-small-cell" v-for="item in codex" border :title="item['name']"
    :description="item['description']">
    <template #icon>
      <template v-if="item['icon'] !== undefined">
      <var-icon class="append-icon" :size="36" :name="`${global.staticUrl}${item['icon']}`" />
    </template>
    </template>
  </var-cell>
</template>

<script>
export default {
  props: ['codex'],
}
</script>