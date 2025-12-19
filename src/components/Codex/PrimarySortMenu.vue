<script setup lang="ts">
import config from '@/config'
import { useSortState } from '@/stores/sort'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'

const sortState = useSortState()
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>
    <v-list density="compact" color="secondary">
      <template v-for="(value, key, index) in config.primarySort" :key="index">
        <v-list-item
          :value="key"
          :active="sortState.primary === key"
          @click="sortState.primary = key"
        >
          <v-list-item-title>
            {{ $t('sort.primary.' + value.key) }}
            <template v-if="value.asc !== undefined">
              <v-icon v-if="value.asc" :icon="mdiArrowUp"></v-icon>
              <v-icon v-else :icon="mdiArrowDown"></v-icon>
            </template>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>
