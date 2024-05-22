<script setup lang="ts">
import { getStaticUrl } from '@/plugins/utils';
</script>

<template>
  <var-cell class="text-cell" v-for="entry, index in entries" :title="entry.name" :key="index"
    :description="entry.description">
    <template #icon>
      <var-icon v-if="entry.icon !== undefined" class="append-icon" :size="36" :name="getStaticUrl(entry.icon)" />
    </template>
  </var-cell>
</template>

<script lang="ts">
export default {
  props: {
    entries: {
      type: Object,
    },
  }
}
</script>