<script setup lang="ts">
import { useCodexState } from '@/store';
</script>

<template>
  <template v-if="codexState.basedItem['description'] !== undefined">
    <var-card class="card" :title="$t('description')">
      <template #description>
        <div class="card-description">
          {{ codexState.basedItem['description'] }}
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexState = useCodexState();
</script>