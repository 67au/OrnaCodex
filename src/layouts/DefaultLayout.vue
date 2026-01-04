<script setup lang="ts">
import AppLocaleSwitch from '@/components/AppLocaleSwitch.vue'
import AppSettings from '@/components/AppSettings.vue'
import AppUpdateBanner from '@/components/AppUpdateBanner.vue'

const drawer: Ref<boolean | null> = ref(null)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <v-app>
    <slot name="drawer"></slot>

    <v-app-bar :elevation="2" color="primary">
      <template v-if="$slots.extension" v-slot:extension>
        <slot name="extension"></slot>
      </template>
      <template v-if="$vuetify.display.mobile" v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      </template>

      <v-app-bar-title>{{ props.title }}</v-app-bar-title>
      <template v-slot:append>
        <div class="d-flex ga-1">
          <slot name="tools"></slot>
          <AppLocaleSwitch></AppLocaleSwitch>
          <AppSettings></AppSettings>
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
      :permanent="!$vuetify.display.mobile"
    >
      <slot name="slide"></slot>
    </v-navigation-drawer>

    <v-main>
      <AppUpdateBanner></AppUpdateBanner>
      <v-container class="pa-0 pb-16">
        <slot> </slot>
      </v-container>
    </v-main>
  </v-app>
</template>
