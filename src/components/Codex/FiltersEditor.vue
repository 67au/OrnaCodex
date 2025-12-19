<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { useFiltersState } from '@/stores/filters'
import type { CodexEntryKeys } from '@/types/filters'
import { mdiClose, mdiCloseCircle, mdiRestart } from '@mdi/js'

const dialog = shallowRef(false)

const codexState = useCodexState()
const filtersState = useFiltersState()

const optionKeys = computed(() => {
  const keys = Object.keys(codexState.options)
  const nonPlus = keys.filter((k: string) => !k.startsWith('+'))
  const plusKeys = keys.filter((k: string) => k.startsWith('+')).sort()
  return nonPlus.concat(plusKeys)
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    opacity="0.1"
    scrollable
    :fullscreen="$vuetify.display.smAndDown"
    :transition="$vuetify.display.smAndDown ? 'dialog-bottom-transition' : 'fade-transition'"
    :max-width="$vuetify.display.smAndDown ? undefined : 600"
  >
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card density="compact" :rounded="!$vuetify.display.smAndDown">
        <v-toolbar density="compact">
          <v-toolbar-title>{{ $t('tools.filters') }} </v-toolbar-title>
          <template v-slot:append>
            <div class="d-flex ga-1">
              <v-btn :icon="mdiRestart" @click="filtersState.$reset"></v-btn>
              <v-btn
                v-if="!$vuetify.display.smAndDown"
                :icon="mdiCloseCircle"
                @click="isActive.value = false"
              ></v-btn>
            </div>
          </template>
          <template v-slot:prepend>
            <v-btn
              v-if="$vuetify.display.smAndDown"
              :icon="mdiClose"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list>
          <v-list-item class="py-0" density="compact" :title="$t('filters.title')"></v-list-item>
          <v-list-item>
            <v-chip-group color="secondary" :model-value="filtersState.keys" column multiple>
              <v-chip
                v-for="(key, index) in optionKeys"
                rounded="lg"
                variant="tonal"
                :key="index"
                :value="key"
                :text="$t((key.startsWith('+') ? 'stats.' : 'meta.') + key)"
                @click="filtersState.setFilter(key as CodexEntryKeys)"
              >
              </v-chip>
            </v-chip-group>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item class="py-0" density="compact" :title="$t('filters.options.title')">
          </v-list-item>
          <v-list-item>
            <v-chip-group
              color="secondary"
              :model-value="filtersState.optionKeys"
              column
              multiple
              filter
            >
              <v-chip
                v-for="(value, key, index) in filtersState.options"
                rounded="lg"
                variant="tonal"
                :key="index"
                :value="key"
                :text="$t('filters.options.' + key)"
                @click="filtersState.options[key] = !filtersState.options[key]"
              >
              </v-chip>
            </v-chip-group>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </v-dialog>
</template>
