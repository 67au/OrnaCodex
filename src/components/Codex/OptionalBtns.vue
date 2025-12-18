<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { settingsStorage } from '@/storages/settings'
import { useCompareState } from '@/stores/compare'
import {
  mdiCalculator,
  mdiEye,
  mdiPencilCircleOutline,
  mdiScaleBalance,
  mdiSwapHorizontalCircleOutline,
} from '@mdi/js'
import GearViewer from './GearViewer.vue'
const props = defineProps({
  entry: {
    type: Object as PropType<CodexEntry>,
    required: true,
  },
  size: {
    type: String,
  },
})

const compareState = useCompareState()
const compare = shallowRef(true)

function addCompare() {
  compare.value = compareState.add(props.entry.id)
}
</script>

<template>
  <v-btn
    v-if="entry.category === 'items' && entry.isMaterial"
    :size="size"
    variant="text"
    color="secondary"
    :icon="mdiSwapHorizontalCircleOutline"
    :to="{ name: 'proof', query: { id: entry.id } }"
  ></v-btn>
  <v-btn
    v-if="entry.category === 'items' && entry.isAssessable"
    :size="size"
    variant="text"
    color="secondary"
    :icon="mdiCalculator"
    :to="{ name: 'assess', query: { id: entry.id } }"
  ></v-btn>
  <v-btn
    v-if="settingsStorage.enemyEditor && ['bosses', 'monsters', 'raids'].includes(entry.category)"
    :size="size"
    variant="text"
    color="secondary"
    :icon="mdiPencilCircleOutline"
    :to="{ name: 'enemy', query: { id: entry.cacheKey } }"
  ></v-btn>

  <v-snackbar location="top" :color="compare ? 'success' : 'error'">
    <div v-if="compare">{{ $t('compare.add') + ': ' + entry.name }}</div>
    <div v-else>{{ $t('compare.full') }}</div>
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="entry.category === 'items' && entry.isComparable && !entry.isCelestialWeapon"
        :size="size"
        variant="text"
        color="secondary"
        :icon="mdiScaleBalance"
        v-bind="props"
        @click="addCompare"
      ></v-btn>
    </template>
  </v-snackbar>

  <GearViewer
    v-if="entry.category === 'items' && entry.isComparable && !entry.isCelestialWeapon"
    :entry="entry"
  >
    <template v-slot:activator="{ activator: activator }">
      <v-btn
        :icon="mdiEye"
        :size="size"
        color="secondary"
        variant="text"
        v-bind="activator"
      ></v-btn>
    </template>
  </GearViewer>
</template>
