<script setup lang="ts">
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import { store } from '@/store';
import { i18n } from '@/i18n';
import { useDark } from '@/styles';
import AppHeader from './components/AppHeader.vue';
import AppLocaleSwitch from './components/AppLocaleSwitch.vue';
import AppThemeSwitch from './components/AppThemeSwitch.vue';
import AppGithub from './components/AppGithub.vue';

useDark();
</script>

<template>
  <div class="layout" id="main">
    <AppHeader :title="$t('title')">
      <template #right>
        <AppLocaleSwitch />
        <AppThemeSwitch />
        <AppGithub link="https://github.com/67au/OrnaCodex" />
      </template>
    </AppHeader>
    <var-loading description="LOADING" :loading="loading">
      <var-skeleton card :loading="loading" />
    </var-loading>
    <template v-if="!loading">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="!$route.meta.keepAlive" />
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <var-back-top :duration="500" />
      </router-view>
    </template>
  </div>
</template>

<script lang="ts">
const baseLang: string = 'en';

export default {
  created() {
    import(`@/assets/json/codex.json`).then((module) => {
      store.codex.meta = module.default;
      for (const [lang, msg] of Object.entries(store.codex.meta.translation)) {
        i18n.global.mergeLocaleMessage(lang, msg);
      }
      for (const [lang, msg] of Object.entries(store.codex.meta.stats_translation)) {
        i18n.global.mergeLocaleMessage(lang, msg);
      }
      this.loadLangCodex(store.state.language, true, () => {
        this.loadLangCodex(baseLang, false, () => {
          store.codexViewLoading = false;
        });
      });
    });
  },
  mounted() {
    watch(() => i18n.global.locale.value, () => {
      if (store.codex.data[store.state.language] === undefined) {
        this.loadLangCodex(store.state.language, true, () => {});
      };
    });
  },
  methods: {
    loadLangCodex(lang: string, isLoad: boolean, callback: Function) {
      if (isLoad) { this.loading = true; }
      if (store.codex.data[lang] !== undefined) {
        callback();
      }
      import(`@/assets/json/codex.${lang}.json`).then((module) => {
        store.codex.data[lang] = module.default;
        if (isLoad) { this.loading = false; }
        if (callback !== undefined) {
          callback();
        }
      });
    }
  },
  data() {
    return {
      store,
      loading: true,
    }
  },
}

</script>

<style>
* {
  box-sizing: border-box;
}

body {
  transition: background-color 0.25s, color 0.25s;
  color: var(--color-text);
  background-color: var(--color-body);
  overflow: hidden;
  margin: 0;
}

.layout {
  padding: 60px 3px;
  overflow-y: auto;
  height: 100vh;
}
</style>
