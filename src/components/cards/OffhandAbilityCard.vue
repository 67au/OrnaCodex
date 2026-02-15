<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import DropsItem from './DropsItem.vue'

const entry = inject<ComputedRef<CodexEntry>>('entry')
</script>

<template>
  <DetailCard v-if="entry?.offhandAbilityEntry" :title="$t('meta.offhand_ability')">
    <template v-slot:default>
      <div class="pb-2">
        <DropsItem :entry="entry.offhandAbilityEntry" />
        <v-divider class="mx-2" />
      </div>
    </template>
  </DetailCard>
</template>
