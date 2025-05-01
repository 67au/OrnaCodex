<script setup lang="ts">
import { mdiChevronDoubleUp } from '@mdi/js'
import { useGoTo } from 'vuetify'

const offsetTop = ref(0)
function onScroll() {
  offsetTop.value = window.scrollY
}

const goTo = useGoTo()
function backTop() {
  goTo(0)
}
</script>

<template>
  <v-fab-transition>
    <v-btn
      :icon="mdiChevronDoubleUp"
      @click="backTop"
      v-show="offsetTop !== 0"
      v-scroll="onScroll"
    ></v-btn>
  </v-fab-transition>
</template>
