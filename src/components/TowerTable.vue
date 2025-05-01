<script setup lang="ts">
import { mdiClose } from '@mdi/js'

const dialog = shallowRef(false)

defineProps({
  name: {
    type: String,
  },
})
</script>

<template>
  <v-dialog
    close-on-back
    :opacity="0.1"
    transition="fade-transition"
    :max-width="$vuetify.display.mobile ? undefined : 600"
    v-model="dialog"
    scrollable
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card rounded>
        <v-toolbar>
          <v-toolbar-title>
            {{ name }}
          </v-toolbar-title>
          <template v-slot:append>
            <div class="d-flex ga-1">
              <slot name="actions"></slot>
              <v-btn :icon="mdiClose" variant="text" @click="isActive.value = false"></v-btn>
            </div>
          </template>
        </v-toolbar>

        <slot></slot>
      </v-card>
    </template>
  </v-dialog>
</template>
