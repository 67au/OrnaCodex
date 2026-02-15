<script setup lang="ts">
import config from '@/config'
import type { FilterOperator } from '@/types/filters'
import { omitBy } from 'es-toolkit'
import type { PropType } from 'vue'

const props = defineProps({
  operator: {
    type: String as PropType<FilterOperator>,
    required: true,
  },
  all: {
    type: Boolean,
    default: false,
  },
})

const ops = computed(() =>
  omitBy(config.operators, (_, k) => {
    return k.endsWith('all') && !props.all
  }),
)
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props: activator }">
      <v-btn
        v-bind="activator"
        :icon="config.operators[props.operator].icon"
        :color="config.operators[props.operator].color"
        variant="tonal"
      />
    </template>
    <v-list>
      <v-list-item
        :prepend-icon="item!.icon"
        :color="item!.color"
        density="compact"
        :title="$t('filters.operator.' + op)"
        v-for="(item, op) in ops"
        :key="op"
        :active="props.operator === op"
        @click="$emit('update:operator', op)"
      >
      </v-list-item>
    </v-list>
  </v-menu>
</template>
