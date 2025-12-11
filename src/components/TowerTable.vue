<script setup lang="ts">
import { mdiClose, mdiCloseCircle } from '@mdi/js'

const dialog = shallowRef(false)

const props = defineProps({
  name: {
    type: String,
  },
})
</script>

<template>
  <v-dialog
    close-on-back
    :opacity="0.1"
    :max-width="$vuetify.display.smAndDown ? undefined : 600"
    :transition="$vuetify.display.smAndDown ? 'dialog-bottom-transition' : 'fade-transition'"
    :fullscreen="$vuetify.display.smAndDown"
    v-model="dialog"
    scrollable
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card :rounded="!$vuetify.display.smAndDown">
        <v-toolbar>
          <v-toolbar-title>
            {{ props.name }}
          </v-toolbar-title>
          <template v-slot:append>
            <div class="d-flex ga-1">
              <slot name="actions"></slot>
              <v-btn
                v-if="!$vuetify.display.smAndDown"
                :icon="mdiCloseCircle"
                @click="isActive.value = false"
              ></v-btn>
            </div>
          </template>
          <template v-slot:prepend>
            <v-btn
              v-if="$vuetify.display.smAndDown"
              :icon="mdiClose"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-toolbar>

        <slot></slot>
      </v-card>
    </template>
  </v-dialog>
</template>
