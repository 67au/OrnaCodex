<script setup lang="ts">
import { useCompareState } from '@/stores/compare'
import { useSettingsStore } from '@/stores/settings'
import {
  mdiBookOpen,
  mdiCalculator,
  mdiChessRook,
  mdiScaleBalance,
  mdiSpaceInvaders,
  mdiSwapHorizontalCircleOutline,
} from '@mdi/js'

const compareState = useCompareState()
const settings = useSettingsStore()
</script>

<template>
  <v-list>
    <v-list-item :prepend-icon="mdiBookOpen" :title="$t('title')" to="/" link> </v-list-item>
    <v-list-item :prepend-icon="mdiCalculator" :title="$t('assess.title')" to="/assess" link>
    </v-list-item>
    <v-list-item :prepend-icon="mdiScaleBalance" :title="$t('compare.title')" to="/compare" link>
      <template v-slot:append>
        <v-badge
          v-if="compareState.count > 0"
          color="error"
          :content="compareState.count"
          inline
        ></v-badge>
      </template>
    </v-list-item>
    <v-list-item
      :prepend-icon="mdiSwapHorizontalCircleOutline"
      :title="$t('proof.title')"
      to="/proof"
      link
    >
    </v-list-item>
    <v-list-item :prepend-icon="mdiChessRook" :title="$t('tower.title')" to="/tower" link>
    </v-list-item>
    <v-list-item
      v-if="settings.enemyEditor"
      :prepend-icon="mdiSpaceInvaders"
      :title="$t('enemy.title')"
      to="/enemy"
      link
    >
    </v-list-item>
  </v-list>
</template>
