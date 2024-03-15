<script setup lang="ts">
import { store } from '@/store';
</script>

<template>
  <template v-if="store.codex.basedItem['description'] !== undefined">
    <var-card class="card" :title="$t('description')">
      <template #description>
        <div class="card-description">
          {{ store.codex.basedItem['description'] }}
        </div>
      </template>
    </var-card>
  </template>
</template>