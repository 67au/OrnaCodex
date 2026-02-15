<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import StatsChips from '@/components/chips/StatsChips.vue'
import DetailCard from '@/components/shared/DetailCard.vue'

const entry = inject<ComputedRef<CodexEntry>>('entry')
</script>

<template>
  <DetailCard v-if="entry?.stats" :title="$t('meta.stats')">
    <template v-slot:default>
      <div class="pa-2 d-flex flex-wrap ga-1">
        <StatsChips :entry="entry" />
      </div>
    </template>
  </DetailCard>
</template>
