<script setup lang="ts">
import SubSettings from './Settings/SubSettings.vue'
import { setTheme, themesName } from '@/styles'
import { mdiPalette } from '@mdi/js'
import { useTheme } from 'vuetify'

const currentTheme = useTheme()
watch(
  () => currentTheme.global.name.value,
  (newValue) => {
    setTheme(newValue)
  },
)
</script>

<template>
  <SubSettings :title="$t('settings.theme.title')">
    <template v-slot:activator="{ activator }">
      <v-list-item
        :title="$t('settings.theme.title')"
        :subtitle="`${$t('settings.theme.currentTheme')}: ${currentTheme.global.name.value}`"
        v-bind="activator"
      >
      </v-list-item>
    </template>
    <v-list>
      <v-list-item>
        <template #title>
          <v-card
            class="ma-auto my-4 w-100"
            max-width="600"
            min-width="300"
            :width="$vuetify.display.mobile ? '66vw' : '70vw'"
          >
            <v-card-title class="bg-primary d-flex">
              {{ currentTheme.global.name.value }}
              <v-spacer> </v-spacer>
              <v-icon :icon="mdiPalette"></v-icon>
            </v-card-title>

            <v-card-text class="d-flex flex-wrap bg-background pt-4">
              <v-chip class="ma-1" color="primary" rounded>Primary</v-chip>
              <v-chip class="ma-1" color="secondary" rounded>Secondary</v-chip>
              <v-chip class="ma-1" color="tertiary" rounded>Tertiary</v-chip>
              <v-chip class="ma-1" color="surface" variant="elevated" rounded>Surface</v-chip>
            </v-card-text>
          </v-card>
        </template>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-subheader>{{ $t('settings.theme.choice') }}</v-list-subheader>
      <v-list-item>
        <v-radio-group v-model="currentTheme.global.name.value">
          <v-radio v-for="theme in themesName" :label="theme" :value="theme" :key="theme"></v-radio>
        </v-radio-group>
      </v-list-item>
    </v-list>
  </SubSettings>
</template>
