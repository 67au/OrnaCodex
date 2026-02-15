<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
})
</script>

<template>
  <v-card rounded="lg">
    <v-list-item density="compact" class="bg-surface-light" slim>
      <template v-slot:title>
        <template v-if="$slots.title">
          <slot name="title"></slot>
        </template>
        <template v-else>
          <v-list-item-title class="text-uppercase">
            {{ props.title }}
          </v-list-item-title>
        </template>
      </template>
      <template v-slot:append v-if="$slots.actions">
        <slot name="actions"></slot>
      </template>
    </v-list-item>
    <slot></slot>
  </v-card>
</template>
