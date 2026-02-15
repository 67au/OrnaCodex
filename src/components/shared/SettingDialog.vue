<script setup lang="ts">
import { mdiArrowLeft, mdiCloseCircle } from '@mdi/js'

const dialog = shallowRef(false)

const props = defineProps({
  title: {
    type: String,
  },
  sub: {
    type: Boolean,
    default: false,
  },
})

const maxWidth = computed(() => (props.sub ? 540 : 600))
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    scrollable
    :opacity="props.sub ? 0.2 : 0.1"
    :transition="$vuetify.display.smAndDown ? 'slide-x-reverse-transition' : 'fade-transition'"
    :fullscreen="$vuetify.display.smAndDown"
    :max-width="$vuetify.display.smAndDown ? undefined : maxWidth"
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :props="activator"></slot>
    </template>

    <template v-slot="{ isActive }">
      <v-card :rounded="!$vuetify.display.smAndDown">
        <v-toolbar :density="$vuetify.display.smAndDown ? undefined : 'compact'">
          <template v-slot:prepend>
            <v-btn
              :icon="mdiArrowLeft"
              @click="dialog = false"
              v-if="$vuetify.display.smAndDown"
            ></v-btn>
          </template>

          <template v-if="$slots.content">
            <slot name="content"></slot>
          </template>
          <template v-else>
            <v-toolbar-title>{{ props.title }}</v-toolbar-title>
          </template>

          <template v-slot:append>
            <slot name="actions"></slot>
            <v-btn
              :icon="mdiCloseCircle"
              variant="text"
              @click="dialog = false"
              v-if="!$vuetify.display.smAndDown"
            ></v-btn>
          </template>
        </v-toolbar>

        <slot :is-active="isActive"></slot>
      </v-card>
    </template>
  </v-dialog>
</template>
