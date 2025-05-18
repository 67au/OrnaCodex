<script setup lang="ts">
import { settingsStorage } from '@/storages/settings'
import { useCompareState } from '@/stores/compare'
import {
  mdiBookOpen,
  mdiCalculator,
  mdiChessRook,
  mdiScaleBalance,
  mdiSkullOutline,
  mdiSwapHorizontalCircleOutline,
} from '@mdi/js'

const compareState = useCompareState()
</script>

<template>
  <v-list>
    <v-list-item :prepend-icon="mdiBookOpen" :title="$t('title')" to="/" link> </v-list-item>
    <v-list-item :prepend-icon="mdiCalculator" :title="$t('tools.assess')" to="/assess" link>
    </v-list-item>
    <v-list-item :prepend-icon="mdiScaleBalance" :title="$t('tools.compare')" to="/compare" link>
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
      :title="$t('tools.proof')"
      to="/proof"
      link
    >
    </v-list-item>
    <v-list-item :prepend-icon="mdiChessRook" :title="$t('tools.tower')" to="/tower" link>
    </v-list-item>
    <v-list-item
      v-if="settingsStorage.enemyEditor"
      :prepend-icon="mdiSkullOutline"
      :title="$t('tools.enemy')"
      to="/enemy"
      link
    >
    </v-list-item>
  </v-list>
</template>
