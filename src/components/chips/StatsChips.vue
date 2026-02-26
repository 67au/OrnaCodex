<script setup lang="ts">
import { getStatConditionName, getStatName, getStatValueName } from '@/utils'
import { getCodexEntryByKey, type CodexEntry } from '@/utils/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import colors from '@/styles/colors.module.scss'
import { findIndex, get, isArray } from 'es-toolkit/compat'
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

interface StatItem {
  key: string
  name?: string
  value?: string | number
  condition?: string
  color?: string
  variant?: Variant
  to?: string
}

const statsArray = computed(() => {
  const tmp: Array<StatItem> = []
  props.entry.statsArray.forEach(([key, value]) => {
    const t: StatItem = {
      key: 'stats.' + key,
      value: undefined,
    }

    const cond = props.entry.stats_conditions?.[key]
    if (cond) {
      t['condition'] = getStatConditionName(cond)
    }

    if (isArray(value)) {
      value.forEach((v) => {
        if (typeof v === 'string') {
          tmp.push({
            ...t,
            value: getStatValueName(t.key, v),
            color: get(colors, v),
          })
        } else {
          if ('key' in v && !props.mini) {
            const spell = v.key ? getCodexEntryByKey(v.key) : undefined
            tmp.push({
              ...t,
              name: getStatName(t.key),
              value: spell ? spell.name : getStatValueName(t.key, v.name),
              to: spell?.url,
              color: spell ? 'secondary' : undefined,
              variant: spell ? 'tonal' : undefined,
            })
          } else {
            tmp.push({
              ...t,
              name: getStatName(t.key),
              value: getStatValueName(t.key, v.name),
            })
          }
        }
      })
    } else {
      tmp.push({
        ...t,
        name: typeof value === 'boolean' ? undefined : getStatName(t.key),
        value: typeof value === 'boolean' ? getStatName(t.key) : getStatValueName(t.key, value),
      })
    }
  })
  if (!props.sorted) {
    return tmp
  }
  const sortState = useSortState()
  const index = findIndex(tmp, { key: sortState.key })
  if (index > -1) {
    return [
      {
        ...tmp[index],
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
      <v-chip :text="stat.value" :color="stat.color" :variant="stat.variant" :to="stat.to">
        <template v-slot:prepend v-if="stat.name">
          <span class="mr-1">{{ stat.name + ':' }}</span>
        </template>
        <template v-slot:append v-if="stat.condition">
          <span class="ml-1">{{ stat.condition}}</span>
        </template>
      </v-chip>
    </template>
  </v-defaults-provider>
</template>
