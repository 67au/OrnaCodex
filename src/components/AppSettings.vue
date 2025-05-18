<script setup lang="ts">
import { mdiCog, mdiDatabase, mdiGithub, mdiUpdate } from '@mdi/js'
import ThemeSettings from './ThemeSettings.vue'
import MainSettings from './Settings/MainSettings.vue'
import { settingsStorage } from '@/storages/settings'
import config from '@/config'
import { useCodexState } from '@/stores/codex'

const codexState = useCodexState()
</script>

<template>
  <MainSettings>
    <template v-slot:activator="{ activator: activator }">
      <v-btn :icon="mdiCog" variant="text" v-bind="activator"></v-btn>
    </template>

    <v-list lines="two">
      <v-list-subheader>{{ $t('settings.general.title') }}</v-list-subheader>

      <ThemeSettings></ThemeSettings>

      <v-list-item
        :subtitle="$t('settings.general.displayStatsSubtitle')"
        :title="$t('settings.general.displayStats')"
        @click="settingsStorage.displayStats = !settingsStorage.displayStats"
      >
        <template v-slot:prepend>
          <v-list-item-action start>
            <v-checkbox-btn v-model="settingsStorage.displayStats" color="primary"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-list-item
        :subtitle="$t('settings.general.displayCardSubtitle')"
        :title="$t('settings.general.displayCard')"
        @click="settingsStorage.displayCard = !settingsStorage.displayCard"
      >
        <template v-slot:prepend>
          <v-list-item-action start>
            <v-checkbox-btn v-model="settingsStorage.displayCard" color="primary"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-subheader>API</v-list-subheader>
      <v-list-item
        :subtitle="$t('settings.general.enemyEditorSubtitle')"
        :title="$t('settings.general.enemyEditor')"
        @click="settingsStorage.enemyEditor = !settingsStorage.enemyEditor"
      >
        <template v-slot:prepend>
          <v-list-item-action start>
            <v-checkbox-btn v-model="settingsStorage.enemyEditor" color="primary"></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="'More features are under development.'"> </v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>{{ $t('settings.credit.title') }}</v-list-subheader>
      <v-list-item
        :title="$t('settings.credit.website')"
        subtitle="https://playorna.com/"
        link
        href="https://playorna.com/"
        target="_blank"
      >
        <template v-slot:prepend>
          <v-avatar size="64">
            <v-img :src="config.ornaStaticUrl + '/img/home/orna_full.png'"></v-img>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>{{ $t('settings.about.title') }}</v-list-subheader>
      <v-list-item
        :prepend-icon="mdiGithub"
        :title="$t('settings.about.author')"
        subtitle="FQEGG"
        link
        href="https://github.com/67au"
        target="_blank"
      >
      </v-list-item>
      <v-list-item
        :prepend-icon="mdiUpdate"
        :title="$t('settings.about.appVersion')"
        :subtitle="config.version"
        link
        href="https://github.com/67au/OrnaCodex"
        target="_blank"
      >
      </v-list-item>
      <v-list-item
        :prepend-icon="mdiDatabase"
        :title="$t('settings.about.apiUpdatedAt')"
        :subtitle="codexState.updatedAt.toLocaleString()"
        link
        href="https://github.com/67au/OrnaCodexCrawler"
        target="_blank"
      >
      </v-list-item>
    </v-list>
  </MainSettings>
</template>
