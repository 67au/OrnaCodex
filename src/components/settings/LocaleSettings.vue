<script setup lang="ts">
import SettingDialog from '@/components/shared/SettingDialog.vue'
import { locales, i18n } from '@/i18n'
import { LANG_DISPLAY_NAME, type Locale } from '@/i18n/config'
import { useAppState } from '@/stores/app'
import { useLocaleSettingsStore } from '@/stores/settings'
import { mdiCog, mdiContentSave, mdiHeart, mdiHeartOutline } from '@mdi/js'
import { head } from 'es-toolkit'

const selectedLocales = ref(locales)
const locale = ref(i18n.global.locale.value)

function setPrefLocale(lang: Locale) {
  locale.value = lang
  if (!selectedLocales.value.includes(lang)) {
    selectedLocales.value.push(lang)
  }
}

function selectLocale(value: { id: unknown; value: boolean; path: unknown[] }) {
  const lang = value.id as Locale
  const index = selectedLocales.value.indexOf(lang)
  if (index === -1) {
    selectedLocales.value.push(lang)
  } else {
    selectedLocales.value.splice(index, 1)
  }
  if (locale.value === lang) {
    locale.value = head(selectedLocales.value) ?? ''
  }
}

async function saveLocales() {
  const localeSettings = useLocaleSettingsStore()
  localeSettings.value.locale = locale.value
  localeSettings.value.locales = selectedLocales.value

  const appState = useAppState()
  await appState.forceUpdate()
  nextTick(() => setTimeout(() => window.location.reload(), 1000))
}
</script>

<template>
  <SettingDialog :title="$t('settings.locale.title')">
    <template v-slot:activator="{ props: activator }">
      <v-list-item
        v-bind="activator"
        key="setting"
        :title="$t('settings.locale.title')"
        :append-icon="mdiCog"
      />
    </template>

    <v-card variant="text">
      <v-list
        v-model:selected="selectedLocales"
        select-strategy="leaf"
        lines="two"
        @click:select="selectLocale"
      >
        <v-list-subheader>
          {{ $t('settings.locale.choice') }}
        </v-list-subheader>
        <v-list-item
          silm
          v-for="(name, lang) in LANG_DISPLAY_NAME"
          :value="lang"
          :title="name"
          :key="lang"
          :ripple="false"
          :disabled="selectedLocales.length === 1 && selectedLocales[0] === lang"
        >
          <template v-slot:prepend="{ isSelected, select }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isSelected" @update:model-value="select" />
            </v-list-item-action>
          </template>

          <template v-slot:subtitle v-if="locale === lang">
            <v-list-item-subtitle class="pb-1">
              {{ $t('settings.locale.prefLocale') }}
            </v-list-item-subtitle>
          </template>

          <template v-slot:append>
            <v-list-item-action end>
              <v-checkbox-btn
                color="red"
                :true-icon="mdiHeart"
                :false-icon="mdiHeartOutline"
                :model-value="locale === lang"
                @update:model-value="setPrefLocale(lang)"
                @click.stop=""
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <div class="pa-4 d-flex justify-end">
        <v-dialog max-width="540">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :prepend-icon="mdiContentSave"
              size="large"
              color="secondary"
              rounded="lg"
              :text="$t('helper.save')"
            />
          </template>

          <template v-slot:default="{ isActive }">
            <v-card :title="$t('settings.locale.applySetting')">
              <v-card-text>
                <v-alert
                  type="warning"
                  variant="tonal"
                  border="start"
                  class="mb-4"
                  :text="$t('helper.reloadAlert')"
                />
                <div>
                  <span class="pr-1"> {{ $t('settings.locale.prefLocale') }}:</span>
                  <span> {{ locale }}</span>
                </div>
                <div>
                  <span class="pr-1"> {{ $t('settings.locale.selectedLocales') }}:</span>
                  <span> {{ selectedLocales.join(', ') }}</span>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-btn :text="$t('helper.close')" @click="isActive.value = false" />
                <v-btn :text="$t('helper.apply')" @click="saveLocales" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </v-card>
  </SettingDialog>
</template>
