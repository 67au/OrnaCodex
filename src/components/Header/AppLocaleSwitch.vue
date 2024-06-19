<script setup lang="ts">
import { ref } from 'vue'
import { type Locale, i18n, setLocale } from '@/i18n'

const show = ref(false)

const supportedLanguages: Array<[Locale, string]> = [
  ['zh-hans', '简体中文'],
  ['zh-hant', '繁體中文'],
  ['en', 'English']
]

function getI18nActiveStyles(locale: Locale) {
  return {
    color: i18n.global.locale.value === locale ? 'var(--color-primary)' : undefined,
    backgroundColor:
      i18n.global.locale.value === locale ? 'var(--app-cell-active-background)' : undefined
  }
}
function handleI18nCellClick(locale: Locale) {
  setLocale(locale)
  show.value = false
}
</script>

<template>
  <var-menu close-on-click-reference placement="bottom" offset-y="2vmin" v-model:show="show">
    <var-button text-color="#fff" text round>
      <div class="i-mdi-translate text-xl" />
    </var-button>
    <template #menu>
      <var-cell
        v-for="[key, language] in supportedLanguages"
        ripple
        :style="getI18nActiveStyles(key)"
        :key="key"
        @click="() => handleI18nCellClick(key)"
      >
        {{ language }}
      </var-cell>
    </template>
  </var-menu>
</template>

<style scoped></style>
