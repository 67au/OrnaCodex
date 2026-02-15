<script setup lang="ts">
import type { CodexEntryKey } from '@/types/codex'
import { getCodexEntryByKey } from '@/utils/codex'
import { isUndefined } from 'es-toolkit'
import type { PropType } from 'vue'
import MetaChips from '@/components/chips/MetaChips.vue'
import StatsChips from '@/components/chips/StatsChips.vue'
import MaterialChips from '@/components/chips/MaterialChips.vue'
import { useSettingsStore } from '@/stores/settings'
import { getOptionName, getOptionValueName } from '@/utils'
import { mdiOpenInNew } from '@mdi/js'
import ActionButtons from '@/components/btns/ActionButtons.vue'

const props = defineProps({
  entryKey: {
    type: String as PropType<CodexEntryKey>,
    required: true,
  },
})

const entry = computed(() => getCodexEntryByKey(props.entryKey))

const settings = useSettingsStore()
</script>

<template>
  <template v-if="!isUndefined(entry)">
    <v-card variant="flat" class="pb-2 px-2">
      <div class="ml-1 d-flex align-center">
        <div
          class="text-letter-spacing-2 text-label-medium text-uppercase text-high-emphasis d-flex ga-1 align-center"
        >
          <span class="text-amber-darken-2">{{ entry.tierName }}</span>
          <span>-</span>
          <span>{{ getOptionValueName('category', entry.category) }}</span>
          <template v-if="entry.exotic === 1">
            <span>-</span>
            <span class="exotic">{{ getOptionName('exotic') }}</span>
          </template>
        </div>

        <v-spacer></v-spacer>

        <div class="d-flex flex-wrap">
          <ActionButtons :entry="entry" mini />
          <v-btn
            variant="text"
            size="small"
            color="default"
            :icon="mdiOpenInNew"
            :href="entry.ornaUrl"
            target="_blank"
          />
        </div>
      </div>

      <router-link :to="entry.url" class="text-decoration-none text-color-unset">
        <v-card-item class="pa-0" density="compact">
          <template v-slot:prepend>
            <v-avatar size="48" :rounded="false">
              <v-img :src="entry.iconUrl" :class="entry.iconClass" />
            </v-avatar>
          </template>
          <v-list-item-title class="text-normal">
            {{ entry.name }}
          </v-list-item-title>
          <div class="d-flex flex-wrap ga-1 pt-1">
            <MetaChips :entry="entry" slim mini />
            <template v-if="settings.display.material && entry.upgrade_materials">
              <MaterialChips :entry="entry" />
            </template>
          </div>
        </v-card-item>

        <div class="d-flex flex-column ga-1 pt-2-empty">
          <div
            v-if="settings.display.stats && entry.stats"
            class="d-flex flex-wrap pa-1 border-sm rounded-lg"
            style="width: fit-content"
          >
            <StatsChips :entry="entry" mini sorted />
          </div>
        </div>
      </router-link>
    </v-card>
  </template>
</template>

<style lang="css" scoped>
.pt-2-empty {
  padding-top: 8px;
}
.pt-2-empty:empty {
  padding-top: 0;
}
</style>
