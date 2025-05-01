<script setup lang="ts">
import { i18n, languageName, setLocale } from '@/i18n'
import { mdiTranslate } from '@mdi/js'
</script>

<template>
  <v-btn id="menu-activator" :icon="mdiTranslate" variant="text"></v-btn>
  <v-menu activator="#menu-activator">
    <v-list>
      <v-list-item
        v-for="(item, index) in languageName"
        :key="index"
        :value="item.lang"
        :active="i18n.global.locale.value === item.lang"
        @click="
          () => {
            setLocale(item.lang)
            $vuetify.locale.current = item.lang
          }
        "
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
