<script setup lang="ts">
import { mdiClose } from '@mdi/js'

const dialog = shallowRef(false)

defineProps({
  title: {
    type: String,
  },
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    :opacity="$vuetify.display.mobile ? 0 : 0.2"
    :transition="$vuetify.display.mobile ? 'dialog-bottom-transition' : 'fade-transition'"
    :fullscreen="$vuetify.display.mobile"
    :max-width="$vuetify.display.mobile ? undefined : 600"
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>

    <v-card :rounded="!$vuetify.display.mobile">
      <v-toolbar v-if="$vuetify.display.mobile">
        <v-btn :icon="mdiClose" @click="dialog = false"></v-btn>

        <v-toolbar-title>{{ $t('tools.settings') }}</v-toolbar-title>
      </v-toolbar>

      <v-toolbar v-else>
        <v-toolbar-title>{{ $t('tools.settings') }}</v-toolbar-title>
        <template v-slot:append>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </template>
      </v-toolbar>

      <slot></slot>
    </v-card>
  </v-dialog>
</template>
