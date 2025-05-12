<script setup lang="ts">
import { getOptionValueName } from '@/plugins'
import type { CodexEntry } from '@/types/codex'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import colors from '@/styles/colors.module.scss'
import { useSortState } from '@/stores/sort'
import { findIndex } from 'es-toolkit/compat'
import type { Variant } from 'vuetify/lib/composables/variant.mjs'

const sortState = useSortState()

const props = defineProps({
  stats: {
    type: Object as PropType<CodexEntry['stats']>,
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
  const tmp = Object.entries(props.stats ?? {}).map(([k, stat]) => {
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
            v-for="(elem, index) in stat.value"
            :color="colors[elem]"
            :key="index"
            :text="getOptionValueName(stat.key, elem)"
          ></v-chip>
        </template>
        <template v-else>
          <v-chip :color="stat.color" :variant="stat.variant">
            <template v-if="stat.key === 'costs'">
              {{ `${$t('stats.' + stat.key)}: ${stat.value} ${$t('units.mana')}` }}
            </template>
            <template v-else>
              {{ `${$t('stats.' + stat.key)}: ${stat.value}` }}
            </template>
          </v-chip>
        </template>
      </template>
    </div>
  </v-defaults-provider>
</template>
