<script setup lang="ts">
import { ref } from 'vue'
import { setTheme, currentTheme } from '@/styles'

const show = ref(false)

function getActiveStyles(theme: string) {
  return {
    color: currentTheme.value === theme ? 'var(--color-primary)' : undefined,
    backgroundColor: currentTheme.value === theme ? 'var(--app-cell-active-background)' : undefined
  }
}

function handleCellClick(theme: string) {
  setTheme(theme)
  show.value = false
}
</script>

<template>
  <var-menu close-on-click-reference placement="bottom" offset-y="2vmin" v-model:show="show">
    <var-button text-color="#fff" text round>
      <div class="i-mdi-palette text-xl" />
    </var-button>
    <template #menu>
      <var-cell
        ripple
        :style="getActiveStyles('md2-dark')"
        @click="() => handleCellClick('md2-dark')"
      >
        MD2 Dark
      </var-cell>
      <var-cell
        ripple
        :style="getActiveStyles('md3-dark')"
        @click="() => handleCellClick('md3-dark')"
      >
        MD3 Dark
      </var-cell>
    </template>
  </var-menu>
</template>

<style scoped></style>
