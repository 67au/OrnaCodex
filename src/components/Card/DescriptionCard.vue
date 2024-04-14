<script setup lang="ts">
import { useCodexViewState } from '@/store';
</script>

<template>
  <template v-if="codexViewState.lang['description'] !== undefined">
    <var-card class="card" :title="$t('description')">
      <template #description>
        <div class="card-description">
          {{ codexViewState.lang['description'] }}
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexViewState = useCodexViewState();
</script>