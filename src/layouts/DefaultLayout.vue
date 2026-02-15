<script setup lang="ts">
import AppBackTop from '@/components/AppBackTop.vue'
import AppLocaleSwitch from '@/components/AppLocaleSwitch.vue'
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import AppUpdateBanner from '@/components/AppUpdateBanner.vue'
import AppSettings from '@/components/settings/AppSettings.vue'

const drawer: Ref<boolean | null> = ref(null)

const route = useRoute()
</script>

<template>
  <v-app>
    <slot name="drawer"></slot>

    <v-app-bar color="primary" elevation="4" app>
      <template v-if="$slots.extension" v-slot:extension>
        <slot name="extension"></slot>
      </template>
      <template v-if="!$vuetify.display.mdAndUp" v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      </template>

      <v-app-bar-title>
        {{ $t(route.meta.title ?? '') }}
      </v-app-bar-title>
      <template v-slot:append>
        <div class="d-flex">
          <slot name="tools"></slot>
          <AppBackTop />
          <AppLocaleSwitch />
          <AppSettings />
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
      :permanent="$vuetify.display.mdAndUp"
    >
      <template v-if="$slots.slide">
        <slot name="slide"></slot>
      </template>
      <template v-else>
        <AppSlideMenu />
      </template>
    </v-navigation-drawer>

    <v-main>
      <AppUpdateBanner />
      <div class="pb-16 pt-1">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>
