<script setup lang="ts">
import { setTheme, themesName } from '@/styles'
import { mdiPalette } from '@mdi/js'
import { useTheme } from 'vuetify'
import SettingDialog from '@/components/shared/SettingDialog.vue'

const theme = useTheme()
</script>

<template>
  <SettingDialog :title="$t('settings.theme.title')" sub>
    <template v-slot:activator="{ props: activator }">
      <v-list-item
        :title="$t('settings.theme.title')"
        :subtitle="`${$t('settings.theme.currentTheme')}: ${theme.global.name.value}`"
        v-bind="activator"
        density="compact"
      >
      </v-list-item>
    </template>
    <v-list density="compact">
      <v-list-item class="py-2">
        <v-card>
          <v-card-title class="bg-primary d-flex flex-wrap">
            {{ theme.global.name.value }}
            <v-spacer> </v-spacer>
            <v-icon :icon="mdiPalette"></v-icon>
          </v-card-title>

          <div class="px-2 py-4 d-flex flex-wrap bg-background ga-2">
            <v-chip color="primary" rounded="lg" size="small">Primary</v-chip>
            <v-chip color="secondary" rounded="lg" size="small">Secondary</v-chip>
            <v-chip color="tertiary" rounded="lg" size="small">Tertiary</v-chip>
            <v-chip color="info" rounded="lg" size="small">Info</v-chip>
            <v-chip color="success" rounded="lg" size="small">Success</v-chip>
            <v-chip color="warning" rounded="lg" size="small">Warning</v-chip>
            <v-chip color="error" rounded="lg" size="small">Error</v-chip>
          </div>
        </v-card>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-subheader>{{ $t('settings.theme.choice') }}</v-list-subheader>
      <v-list-item>
        <v-radio-group :model-value="theme.global.name.value">
          <v-radio
            v-for="name in themesName"
            :label="name"
            :value="name"
            :key="name"
            @click="
              () => {
                theme.change(name)
                setTheme(name)
              }
            "
          />
        </v-radio-group>
      </v-list-item>
    </v-list>
  </SettingDialog>
</template>
