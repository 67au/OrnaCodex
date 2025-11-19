<script setup lang="ts">
import { getOptionValueName, getStatConditionName } from '@/plugins'
import { getStatString } from '@/plugins/sort'
import { CodexEntry } from '@/plugins/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import colors from '@/styles/colors.module.scss'
import { useSortState } from '@/stores/sort'
import { findIndex } from 'es-toolkit/compat'
import type { Variant } from 'vuetify/lib/composables/variant.mjs'

const sortState = useSortState()

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  sorted: {
    type: Boolean,
    default: false,
  },
  single: {
    type: Boolean,
    default: false,
  },
  mini: {
    type: Boolean,
    default: false,
  },
})

const _mini = computed(() => props.mini || props.sorted || props.single)

const defaults: DefaultsOptions = {
  VChip: {
    variant: props.mini ? 'text' : 'outlined',
    size: _mini.value ? 'x-small' : 'small',
    rounded: props.mini ? 'sm' : _mini.value ? 'md' : 'lg',
    color: props.mini ? 'default' : 'secondary',
  },
}

const statsArray = computed(() => {
  const tmp = Object.entries(props.entry.raw.stats ?? {}).map(([k, stat]) => {
    return {
      key: k,
      value: stat,
      color: undefined,
      variant: undefined,
    }
  })

  const tmpIndex = findIndex(tmp, { key: sortState.shortKey })

  if (props.single && tmpIndex > -1) {
    return [
      {
        ...tmp[tmpIndex],
        color: props.mini ? 'secondary' : 'primary',
        variant: (props.mini ? 'tonal' : 'flat') as Variant,
      },
    ]
  }

  if (props.sorted && sortState.isActive && tmpIndex > -1) {
    return [
      {
        ...tmp[tmpIndex],
        color: props.mini ? 'secondary' : 'primary',
        variant: (props.mini ? 'tonal' : 'flat') as Variant,
      },
      ...tmp.filter((_, index) => index !== tmpIndex),
    ]
  } else {
    return tmp
  }
})
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <div class="d-flex flex-wrap" :class="{ 'ga-1': !mini }">
      <template v-for="(stat, index) in statsArray" :key="index">
        <template v-if="typeof stat.value === 'boolean'">
          <v-chip
            :color="stat.color"
            :variant="mini ? 'tonal' : 'flat'"
            :text="$t('stats.' + stat.key)"
          ></v-chip>
        </template>
        <template v-else-if="stat.key === 'element'">
          <v-chip
            v-for="(elem, index) in stat.value as Array<string>"
            :color="colors[elem]"
            :key="index"
            :text="getOptionValueName(stat.key, elem)"
          ></v-chip>
        </template>
        <template v-else-if="stat.key?.match(/^\+.*(spell|skill)$/)">
          <v-chip
            v-for="(spell, index) in stat.value"
            :key="index"
            :color="stat.color"
            :variant="stat.variant"
          >
            {{ `${$t('stats.' + stat.key)}: ${$t('stats_text.' + spell)}` }}
            <template
              v-if="
                props.entry.raw.stats_conditions?.[stat.key as string] !== undefined &&
                stat.key !== undefined
              "
            >
              {{ ` (${getStatConditionName(props.entry, stat.key)})` }}
            </template>
          </v-chip>
        </template>
        <template v-else>
          <v-chip :color="stat.color" :variant="stat.variant">
            {{ `${$t('stats.' + stat.key)}: ${getStatString(props.entry, stat.key as string)}` }}
            <template
              v-if="
                props.entry.raw.stats_conditions?.[stat.key as string] !== undefined &&
                stat.key !== undefined
              "
            >
              {{ ` (${getStatConditionName(props.entry, stat.key)})` }}
            </template>
          </v-chip>
        </template>
      </template>
    </div>
  </v-defaults-provider>
</template>
