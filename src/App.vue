<script setup lang="ts">
import MainLayout from './pages/MainLayout.vue'
import { useDark } from '@/styles'
import { useCodexState } from './stores/codex'
import { i18n } from './i18n'
import { useExtraState } from './stores/extra'
import { global } from './plugins/global'
import AppHistory from './components/Header/AppHistory.vue'
import AppCompare from './components/Header/AppCompare.vue'

useDark()
</script>

<template>
  <AppHeader :title="$t('title')">
    <template #right>
      <AppCompare v-if="!isLoading" />
      <AppHistory v-if="!isLoading" />
      <AppLocaleSwitch />
      <AppThemeSwitch />
      <AppGithub :data-created="global.dataCreated" />
    </template>
  </AppHeader>

  <template v-if="isLoading">
    <div class="mt-16">
      <var-loading description="LOADING" :loading="isLoading" class="max-w-lg mx-auto">
        <var-skeleton card :loading="isLoading" />
      </var-loading>
    </div>
  </template>

  <MainLayout>
    <template v-if="!isLoading">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="!route.meta.keepAlive" />
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" />
        </keep-alive>
        <FabTool v-model:display="fabStorage" />
      </router-view>
    </template>
  </MainLayout>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      loading: {
        language: true,
        meta: true
      },
      fabStorage: useLocalStorage('fab', true)
    }
  },
  async created() {
    const codexState = useCodexState()
    import('@/assets/json/codex.json').then((module) => {
      const codex = module.default
      codexState.$patch({
        meta: codex.meta as any,
        extra: codex.extra
      })
      this.loading.meta = false
    })
    watch(
      () => i18n.global.locale.value,
      async (newValue) => {
        if (!(newValue in codexState.langs)) {
          this.loading.language = true
          const codex = await this.getCodexLanuage(newValue)
          codexState.langs[newValue] = {
            base: codex.base,
            abilities: codex.abilities,
            miss: codex.miss
          }
          this.loading.language = false
        }
      },
      { immediate: true }
    )

    const extraState = useExtraState()
    if (extraState.full) {
      extraState.fetchAll()
    }
  },
  computed: {
    isLoading() {
      return this.loading.language || this.loading.meta
    },
    route() {
      return useRoute()
    }
  },
  methods: {
    async getCodexLanuage(language: string) {
      return await import(`@/assets/json/codex.${language}.json`).then((module) => {
        const codex = module.default
        i18n.global.mergeLocaleMessage(language, { meta: codex.meta })
        return codex
      })
    }
  }
})
</script>
