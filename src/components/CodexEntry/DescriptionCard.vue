<script setup lang="ts">
import type { CodexEntry } from '@/types'
</script>

<template>
  <var-card v-if="ce.lang.description !== undefined" class="card" :title="$t('description')">
    <template #description>
      <div class="card-description">
        {{ ce.lang.description }}
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
