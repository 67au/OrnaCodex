<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { useFiltersState } from '@/stores/filters'
import { getOptionName } from '@/utils'
import SettingDialog from '@/components/shared/SettingDialog.vue'
import { mdiRestart } from '@mdi/js'

const codexState = useCodexState()
const filtersState = useFiltersState()

const optionKeys = computed(() => {
  const keys = Object.keys(codexState.meta.options)
  const nonPlus = keys.filter((k: string) => !k.startsWith('stats.'))
  const plusKeys = keys.filter((k: string) => k.startsWith('stats.')).sort()
  return nonPlus.concat(plusKeys)
})
</script>

<template>
  <SettingDialog :title="$t('filters.title')">
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>

    <template v-slot:append>
      <v-btn :icon="mdiRestart" @click="filtersState.$reset"></v-btn>
    </template>

    <template v-slot:default>
      <v-list density="compact">
        <v-list-subheader :title="$t('filters.options.title')"></v-list-subheader>
        <v-list-item>
          <v-chip-group color="secondary" :model-value="filtersState.keys" column multiple>
            <v-chip
              v-for="(key, index) in optionKeys"
              rounded="lg"
              variant="tonal"
              :key="index"
              :value="key"
              :text="getOptionName(key)"
              @click="filtersState.setFilter(key)"
            >
            </v-chip>
          </v-chip-group>
        </v-list-item>

        <v-divider />
      </v-list>
    </template>
  </SettingDialog>
</template>
