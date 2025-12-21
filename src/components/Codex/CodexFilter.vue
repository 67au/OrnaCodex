<script setup lang="ts">
import { mdiPlus, mdiFilter, mdiMagnify, mdiMinus, mdiRestart } from '@mdi/js'
import FiltersEditor from './FiltersEditor.vue'
import { useFiltersState } from '@/stores/filters'
import { useCodexState } from '@/stores/codex'
import { getIcon, getOptionName, getOptionValueName } from '@/plugins'
import type { FilterOptions } from '@/types/filters'

const filtersState = useFiltersState()
const codexState = useCodexState()

const optionItems = computed(() =>
  Object.fromEntries(
    Object.entries(codexState.options).map(([key, options]: [string, Array<string>]) => {
      return [
        key,
        options
          .map((v: string) => {
            return {
              title: getOptionValueName(key, v),
              value: v,
              icon: getIcon(key, v),
            }
          })
          .sort((a, b) => {
            if (key === 'tier') {
              return 1
            }
            return a.title.localeCompare(b.title)
          }),
      ]
    }),
  ),
)
</script>

<template>
  <v-container class="pa-0 d-flex flex-column ga-2">
    <v-card elevation="0">
      <v-list-item density="default" variant="tonal" class="px-2">
        <v-list-item-title>
          <v-text-field
            :prepend-inner-icon="mdiMagnify"
            :label="$t('tools.search')"
            hide-details
            variant="solo"
            class="py-1"
            single-line
            v-model="filtersState.search"
            color="secondary"
            density="compact"
            clearable
          >
          </v-text-field>
        </v-list-item-title>
        <template v-slot:append>
          <v-list-item-action class="ml-n2 d-flex ga-1">
            <v-btn
              :icon="mdiRestart"
              @click="filtersState.$reset"
              variant="tonal"
              border="md"
              color="error"
              elevation="4"
            ></v-btn>
            <FiltersEditor :title="'Filters'">
              <template v-slot:activator="{ activator: activator }">
                <v-btn
                  :icon="mdiFilter"
                  v-bind="activator"
                  variant="tonal"
                  border="md"
                  color="secondary"
                  elevation="4"
                ></v-btn>
              </template>
            </FiltersEditor>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-card>

    <v-card
      class="px-2"
      border="md"
      v-if="filtersState.keys.length > 0 || filtersState.optionKeys.length > 0"
    >
      <v-list class="mx-n4 py-0">
        <template v-if="filtersState.optionKeys.length > 0">
          <v-list-item density="compact" class="py-0">
            <v-list-item-title class="d-flex ga-1">
              <v-chip
                v-for="(key, index) in filtersState.optionKeys"
                rounded="lg"
                size="small"
                variant="tonal"
                color="secondary"
                :key="index"
                :value="filtersState.options[key as keyof FilterOptions]"
                :text="$t('filters.options.' + key)"
                @click:close="filtersState.options[key as keyof FilterOptions] = false"
                closable
              >
              </v-chip>
            </v-list-item-title>
          </v-list-item>
          <v-divider v-if="filtersState.keys.length > 0"></v-divider>
        </template>
        <template
          v-for="([key, filter], index) in Object.entries(filtersState.filters)"
          :key="index"
        >
          <v-list-item
            density="compact"
            class="py-0"
            :class="{ 'pb-2': index === filtersState.keys.length - 1 }"
          >
            <v-autocomplete
              variant="outlined"
              density="compact"
              :label="getOptionName(key)"
              :items="optionItems[key]"
              item-title="title"
              item-value="value"
              color="secondary"
              hide-details
              chips
              multiple
              closable-chips
              clearable
              v-model="filter.value"
              class="pt-2"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :text="item.title" rounded="md">
                  <template v-if="item.raw.icon !== undefined" v-slot:prepend>
                    <v-avatar :rounded="false">
                      <v-img :src="item.raw.icon" class="image-render-pixel"></v-img>
                    </v-avatar>
                  </template>
                </v-chip>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item.title">
                  <template v-if="item.raw.icon !== undefined" v-slot:prepend>
                    <v-avatar :rounded="false">
                      <v-img :src="item.raw.icon" class="image-render-pixel"></v-img>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
              <template v-slot:prepend>
                <v-btn
                  density="compact"
                  :color="filter.exclude ? 'error' : 'secondary'"
                  variant="tonal"
                  rounded="xl"
                  :icon="filter.exclude ? mdiMinus : mdiPlus"
                  @click="filter.exclude = !filter.exclude"
                ></v-btn>
              </template>
            </v-autocomplete>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
  <v-divider v-if="!$vuetify.display.mdAndUp" class="mt-2"></v-divider>
</template>
