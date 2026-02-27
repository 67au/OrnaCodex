<script setup lang="ts">
import { i18n } from '@/i18n'
import { useCompareState } from '@/stores/compare'
import { useMessagesState } from '@/stores/messages'
import type { CodexEntry } from '@/utils/codex'
import {
  mdiCalculator,
  mdiEye,
  mdiInformationOutline,
  mdiScaleBalance,
  mdiSpaceInvaders,
  mdiSwapHorizontalCircleOutline,
} from '@mdi/js'
import type { DefaultsOptions } from 'vuetify/lib/composables/defaults.mjs'
import GearViewer from '@/components/shared/GearViewer.vue'
import EffectViewer from '@/components/shared/EffectViewer.vue'
import config from '@/config'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  mini: {
    type: Boolean,
    defaults: false,
  },
})

const defaults: DefaultsOptions = {
  VBtn: {
    variant: 'text',
    color: props.mini ? 'default' : 'secondary',
    size: props.mini ? 'small' : undefined,
  },
}

const compare = shallowRef(true)
const compareState = useCompareState()
const messageState = useMessagesState()
const settings = useSettingsStore()

function addCompare() {
  compare.value = compareState.add(props.entry.key)
  if (compare.value) {
    messageState.add({
      text: `${i18n.global.t('compare.add')}: ${props.entry.name}`,
      color: 'success',
    })
  } else {
    messageState.add({ text: i18n.global.t('compare.full'), color: 'error' })
  }
}
</script>

<template>
  <v-defaults-provider :defaults="defaults">
    <v-btn
      v-if="entry.category === 'items' && entry.isMaterial"
      :icon="mdiSwapHorizontalCircleOutline"
      :to="{
        name: 'proof',
        query: { id: entry.key },
      }"
    />

    <v-btn
      v-if="entry.category === 'items' && entry.isAssessable"
      :icon="mdiCalculator"
      :to="{
        name: 'assess',
        query: { id: entry.key },
      }"
    />

    <v-btn
      v-if="entry.category === 'items' && entry.isComparable"
      :icon="mdiScaleBalance"
      @click="addCompare"
    />

    <GearViewer v-if="entry.category === 'items' && entry.isComparable" :entry="entry">
      <template v-slot:activator="{ props: activator }">
        <v-btn v-bind="activator" :icon="mdiEye" />
      </template>
    </GearViewer>

    <EffectViewer v-if="entry.hasSkill && entry.category !== 'classes'" :entry="entry">
      <template v-slot:activator="{ props: activator }">
        <v-btn v-bind="activator" :icon="mdiInformationOutline" />
      </template>
    </EffectViewer>

    <v-btn
      v-if="settings.enemyEditor && config.enemySet.has(entry.category)"
      :icon="mdiSpaceInvaders"
      :to="{
        name: 'enemy',
        query: { id: entry.key },
      }"
    />
  </v-defaults-provider>
</template>
