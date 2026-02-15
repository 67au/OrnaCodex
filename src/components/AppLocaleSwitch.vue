<script setup lang="ts">
import { i18n, displayLocales, setLocale, type Locale } from '@/i18n'
import { useCodexState } from '@/stores/codex'
import { useQueryState } from '@/stores/query'
import { mdiCheckCircleOutline, mdiTranslate } from '@mdi/js'
import { useLocale } from 'vuetify'
import LocaleSettings from './settings/LocaleSettings.vue'

const { current } = useLocale()

async function changeLocale(locale: Locale) {
  setLocale(locale)

  current.value = locale
  const codexState = useCodexState()
  await codexState.loadLocaleMessages(locale)
  await codexState.updateTranslation(locale)

  const queryState = useQueryState()
  queryState.queryWorker.setI18n()
}
</script>

<template>
  <v-btn id="menu-activator" :icon="mdiTranslate" variant="text"></v-btn>
  <v-menu activator="#menu-activator">
    <v-list density="compact">
      <v-list-item
        v-for="(item, index) in displayLocales"
        :key="index"
        :value="item.lang"
        :active="i18n.global.locale.value === item.lang"
        @click="changeLocale(item.lang)"
        :append-icon="i18n.global.locale.value === item.lang ? mdiCheckCircleOutline : undefined"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
      <LocaleSettings />
    </v-list>
  </v-menu>
</template>
