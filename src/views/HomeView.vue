<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CodexFilter from '@/components/Codex/CodexFilter.vue'
import CodexList from '@/components/Codex/CodexList.vue'
import AppBackTop from '@/components/AppBackTop.vue'
</script>

<template>
  <DefaultLayout :title="$t('title')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <template v-slot:tools>
      <AppBackTop></AppBackTop>
    </template>
    <v-container fluid class="px-2" max-width="900" id="home-scroll">
      <v-row dense>
        <v-col cols="12">
          <CodexFilter></CodexFilter>
        </v-col>
        <v-col cols="12">
          <CodexList></CodexList>
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>
