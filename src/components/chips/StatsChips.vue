<script setup lang="ts">
import { getStatConditionName, getStatName, getStatValueName } from '@/utils'
import type { CodexEntry } from '@/utils/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import colors from '@/styles/colors.module.scss'
import { findIndex } from 'es-toolkit/compat'
import { useSortState } from '@/stores/sort'
import type { Variant } from 'vuetify/lib/composables/variant.mjs'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  sorted: {
    type: Boolean,
    default: false,
  },
  mini: {
    type: Boolean,
    default: false,
  },
})

const statsArray = computed(() => {
  const tmp = props.entry.statsArray.map(([key, value]) => {
    return {
      key: key,
      value: value,
      statKey: 'stats.' + key,
      color: undefined,
      variant: undefined as Variant | undefined,
    }
  })
  if (!props.sorted) {
    return tmp
  }
  const sortState = useSortState()
  const index = findIndex(tmp, { statKey: sortState.key })
  if (index > -1) {
    return [
      {
        key: tmp[index]!.key,
        value: tmp[index]!.value,
        statKey: tmp[index]!.statKey,
        color: 'secondary',
        variant: 'tonal' as Variant | undefined,
      },
      ...tmp.filter((_, i) => i !== index),
    ]
  }
  return tmp
})

const defaults: DefaultsOptions = props.mini
  ? {
      VChip: {
        variant: 'text',
        size: 'x-small',
        rounded: 'sm',
        color: 'default',
      },
    }
  : {
      VChip: {
        variant: 'text',
        size: 'small',
        rounded: 'sm',
        density: 'compact',
        color: 'default',
      },
    }
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <template v-for="(stat, index) in statsArray" :key="index">
      <template v-if="typeof stat.value === 'number' || typeof stat.value === 'string'">
        <v-chip :color="stat.color" :variant="stat.variant">
          <template v-slot:prepend>
            <span class="pr-1">{{ getStatName(stat.key) + ':' }}</span>
          </template>
          {{ getStatValueName(stat.statKey, stat.value) }}
          <template v-slot:append v-if="props.entry.stats_conditions?.[stat.key] !== undefined">
            <span class="pl-1">
              {{ getStatConditionName(props.entry.stats_conditions?.[stat.key]) }}
            </span>
          </template>
        </v-chip>
      </template>
      <template v-else-if="typeof stat.value === 'boolean'">
        <v-chip variant="tonal" :color="stat.color">
          {{ getStatName(stat.statKey) }}
        </v-chip>
      </template>
      <template v-else-if="stat.key === 'element'">
        <v-chip v-for="v in stat.value as Array<string>" :key="v" :color="colors[v]">
          {{ getStatValueName(stat.statKey, v) }}
        </v-chip>
      </template>
      <template v-else>
        <v-chip v-for="(v, index) in stat.value" :key="index">
          <template v-slot:prepend>
            <span class="pr-1">{{ getStatName(stat.statKey) + ':' }}</span>
          </template>
          {{ getStatValueName(stat.statKey, typeof v === 'string' ? v : v.name) }}
          <template v-slot:append v-if="props.entry.stats_conditions?.[stat.key] !== undefined">
            <span class="pl-1">
              {{ getStatConditionName(props.entry.stats_conditions?.[stat.key]) }}
            </span>
          </template>
        </v-chip>
      </template>
    </template>
  </v-defaults-provider>
</template>
