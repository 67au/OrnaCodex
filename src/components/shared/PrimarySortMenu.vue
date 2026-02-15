<script setup lang="ts">
import config from '@/config'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { isUndefined } from 'es-toolkit'
import type { PropType } from 'vue'

const props = defineProps({
  primary: {
    type: String as PropType<keyof typeof config.primarySort>,
    required: true,
  },
})

const emit = defineEmits(['update:primary'])
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
          :active="props.primary === key"
          @click="emit('update:primary', key)"
        >
          <v-list-item-title>
            {{ $t(isUndefined(value.key) ? 'default' : 'meta.' + value.key) }}
          </v-list-item-title>
          <template v-if="value.asc !== undefined" v-slot:append>
            <v-icon v-if="value.asc" :icon="mdiArrowUp"></v-icon>
            <v-icon v-else :icon="mdiArrowDown"></v-icon>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>
