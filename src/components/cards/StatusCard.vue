<script setup lang="ts">
import type { CodexEntry } from '@/utils/codex'
import DetailCard from '@/components/shared/DetailCard.vue'
import StatusChips from '@/components/chips/StatusChips.vue'
import { getOptionName } from '@/utils'
import type { PropType } from 'vue'
import type { StatusKey } from '@/types/codex'
import StatusColorTooltip from '@/components/shared/StatusColorTooltip.vue'

const entry = inject<ComputedRef<CodexEntry>>('entry')

const props = defineProps({
  name: {
    type: String as PropType<StatusKey>,
    required: true,
  },
})

const statuses = computed(() => entry?.value?.getStatusArray(props.name))
</script>

<template>
  <DetailCard v-if="statuses" :title="$t(getOptionName(props.name))">
    <template v-slot:default>
      <div class="pa-2 d-flex flex-wrap ga-1">
        <StatusChips :statuses="statuses" />
      </div>
    </template>
    <template v-slot:actions>
      <StatusColorTooltip :name="props.name" />
    </template>
  </DetailCard>
</template>
