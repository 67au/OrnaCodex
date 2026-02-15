<script setup lang="ts">
import { mdiCog, mdiDatabase, mdiGithub, mdiOpenInNew, mdiUpdate } from '@mdi/js'
import ThemeSettings from './ThemeSetting.vue'
import { useSettingsStore } from '@/stores/settings'
import config from '@/config'
import SettingDialog from '@/components/shared/SettingDialog.vue'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import { useCodexState } from '@/stores/codex'
import { useExtraState } from '@/stores/extra'
import { useAppState } from '@/stores/app'

const settingsStorage = useSettingsStore()
const codexState = useCodexState()
const extraState = useExtraState()
const appState = useAppState()

async function forceUpdate() {
  await appState.forceUpdate()
  nextTick(() => setTimeout(() => window.location.reload(), 1000))
}

const defaults: DefaultsOptions = {
  VCheckboxBtn: {
    color: 'primary',
  },
}
</script>

<template>
  <SettingDialog :title="$t('settings.title')">
    <template v-slot:activator="{ props: activator }">
      <v-btn :icon="mdiCog" variant="text" v-bind="activator" />
    </template>

    <v-defaults-provider :defaults="defaults">
      <v-list lines="two" slim class="pb-4">
        <v-list-subheader>
          {{ $t('settings.general.title') }}
        </v-list-subheader>

        <ThemeSettings />

        <v-list-item
          :subtitle="$t('settings.general.showPageSubtitle')"
          :title="$t('settings.general.showPage')"
          @click="settingsStorage.display.page = !settingsStorage.display.page"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="settingsStorage.display.page" />
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-list-item
          :subtitle="$t('settings.general.showStatsSubtitle')"
          :title="$t('settings.general.showStats')"
          @click="settingsStorage.display.stats = !settingsStorage.display.stats"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="settingsStorage.display.stats" />
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-list-item
          :subtitle="$t('settings.general.showDetailSubtitle')"
          :title="$t('settings.general.showDetail')"
          @click="settingsStorage.display.detail = !settingsStorage.display.detail"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="settingsStorage.display.detail" />
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-list-item
          :subtitle="$t('settings.general.showMaterialSubtitle')"
          :title="$t('settings.general.showMaterial')"
          @click="settingsStorage.display.material = !settingsStorage.display.material"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="settingsStorage.display.material" />
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider />

        <v-list-subheader> API </v-list-subheader>
        <v-list-item
          :subtitle="$t('settings.general.enemyEditorSubtitle')"
          :title="$t('settings.general.enemyEditor')"
          @click="settingsStorage.enemyEditor = !settingsStorage.enemyEditor"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-checkbox-btn v-model="settingsStorage.enemyEditor" />
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-dialog max-width="540">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :subtitle="$t('settings.general.forceUpdateSubtitle')"
              :title="$t('settings.general.forceUpdate')"
            />
          </template>

          <template v-slot:default="{ isActive }">
            <v-card :title="$t('settings.general.forceUpdate')">
              <div class="px-4">
                <v-alert
                  density="compact"
                  type="warning"
                  variant="tonal"
                  border="start"
                  class="mb-4"
                  :text="$t('helper.reloadAlert')"
                />
              </div>

              <v-card-actions>
                <v-spacer />

                <v-btn :text="$t('helper.close')" @click="isActive.value = false" />
                <v-btn :text="$t('helper.apply')" @click="forceUpdate" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-list-item :title="'More features are under development.'" />

        <v-divider />
        <v-list-subheader>{{ $t('settings.credit.title') }}</v-list-subheader>

        <v-list-item
          :title="$t('settings.credit.website')"
          subtitle="https://playorna.com/"
          link
          href="https://playorna.com/"
          target="_blank"
          :prepend-avatar="config.ornaStaticUrl + '/img/home/orna_full.png'"
          :append-icon="mdiOpenInNew"
        />
        <v-divider />

        <v-list-subheader>{{ $t('settings.about.title') }}</v-list-subheader>
        <v-list-item
          :title="$t('settings.about.author')"
          subtitle="FQEGG"
          link
          href="https://github.com/67au"
          target="_blank"
          :prepend-icon="mdiGithub"
          :append-icon="mdiOpenInNew"
        />

        <v-list-item
          :prepend-icon="mdiUpdate"
          :title="$t('settings.about.appVersion')"
          :subtitle="config.version"
          link
          href="https://github.com/67au/OrnaCodex"
          target="_blank"
          :append-icon="mdiOpenInNew"
        />

        <v-list-item
          :prepend-icon="mdiDatabase"
          :title="$t('settings.about.lastUpdateAt')"
          :subtitle="codexState.lastUpdateAt?.toLocaleString()"
          link
          href="https://github.com/67au/OrnaCodexCrawler/tree/data"
          target="_blank"
          :append-icon="mdiOpenInNew"
        />

        <v-list-item
          :prepend-icon="mdiDatabase"
          :title="$t('settings.about.extraUpdateAt')"
          :subtitle="extraState.lastUpdateAt?.toLocaleString()"
          link
          href="https://github.com/67au/OrnaCodexExtra"
          target="_blank"
          :append-icon="mdiOpenInNew"
        />
      </v-list>
    </v-defaults-provider>
  </SettingDialog>
</template>
