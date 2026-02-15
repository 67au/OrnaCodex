<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import { getOptionName } from '@/utils'
import DropsItem from './DropsItem.vue'

const entry = inject<ComputedRef<CodexEntry>>('entry')

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const entries = computed(() => entry?.value?.getDropEntriesArray(props.name))

const levels = computed(() => entry?.value?.skills_level ?? {})
</script>

<template>
  <DetailCard v-if="entries" :title="$t(getOptionName(props.name))">
    <template v-slot:default>
      <div class="pb-2">
        <template v-for="ent in entries" :key="ent.key">
          <DropsItem :entry="ent" status material :level="levels[ent.key]" />
          <v-divider class="mx-3" />
        </template>
      </div>
    </template>
  </DetailCard>
</template>
