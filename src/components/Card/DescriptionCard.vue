<script setup>
import { store } from '@/store';
</script>

<template>
  <template v-if="store.codex.usedItem['description'] !== undefined">
    <var-card class="card" :title="$t('description')">
      <template #description>
        <div class="card-description">
          {{ store.codex.usedItem['description'] }}
        </div>
      </template>
    </var-card>
  </template>
</template>