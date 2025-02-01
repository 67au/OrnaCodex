<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
</script>

<template>
  <var-card v-if="ce.meta.stats !== undefined" class="card" :title="$t('stats')">
    <template #description>
      <div class="card-description">
        <StatLists :stats="ce.meta.stats" />
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  computed: {
    ce() {
      return this.view as CodexEntry
    }
  }
})
</script>
