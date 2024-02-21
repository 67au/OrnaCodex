<script setup>
import { store } from '@/store';
</script>

<template>
  <template v-if="store.codex.usedItem['ability'] !== undefined">
    <var-card class="card" :title="$t('ability')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-cell" :title="store.codex.usedItem['ability'][0]"
            :description="store.codex.usedItem['ability'][1]">
          </var-cell>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script>
export default {

}
</script>