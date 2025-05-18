<script setup lang="ts">
import {
  mdiPlusCircleOutline,
  mdiFilter,
  mdiMagnify,
  mdiMinusCircleOutline,
  mdiRestart,
} from '@mdi/js'
import FiltersEditor from './FiltersEditor.vue'
import { useFiltersState } from '@/stores/filters'
import { useCodexState } from '@/stores/codex'
import { getIcon, getOptionName, getOptionValueName } from '@/plugins'

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

<!-- <template>
  <v-sheet class="d-flex flex-column ga-3" color="transparent" rounded="lg">
    <v-toolbar rounded="lg">
      <v-text-field
        :prepend-inner-icon="mdiMagnify"
        :label="$t('tools.search')"
        class="px-2"
        hide-details
        variant="solo"
        single-line
        v-model="filtersState.search"
        color="secondary"
        density="compact"
        clearable
      >
      </v-text-field>
      <template v-slot:append>
        <v-btn :icon="mdiRestart" @click="filtersState.$reset"></v-btn>
        <FiltersEditor :title="'Filters'">
          <template v-slot:activator="{ activator: activator }">
            <v-btn :icon="mdiFilter" v-bind="activator"></v-btn>
          </template>
        </FiltersEditor>
      </template>
    </v-toolbar>

    <template v-for="([key, filter], index) in Object.entries(filtersState.filters)" :key="index">
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
            variant="text"
            :icon="filter.exclude ? mdiMinusCircleOutline : mdiPlusCircleOutline"
            @click="filter.exclude = !filter.exclude"
          ></v-btn>
        </template>
      </v-autocomplete>
    </template>
  </v-sheet>
  <v-divider v-if="!$vuetify.display.mdAndUp" class="mt-2"></v-divider>
</template> -->

<template>
  <v-card rounded="lg" color="transparent" elevation="0">
    <v-list-item density="default" variant="tonal" class="px-2 mb-2" rounded="lg">
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
        <v-list-item-action class="d-flex">
          <v-btn
            :icon="mdiRestart"
            @click="filtersState.$reset"
            variant="text"
            color="default"
          ></v-btn>
          <FiltersEditor :title="'Filters'">
            <template v-slot:activator="{ activator: activator }">
              <v-btn :icon="mdiFilter" v-bind="activator" variant="text" color="default"></v-btn>
            </template>
          </FiltersEditor>
        </v-list-item-action>
      </template>
    </v-list-item>

    <template v-for="([key, filter], index) in Object.entries(filtersState.filters)" :key="index">
      <v-list-item density="compact" class="px-0 py-0">
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
          class="py-1"
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
              variant="text"
              :icon="filter.exclude ? mdiMinusCircleOutline : mdiPlusCircleOutline"
              @click="filter.exclude = !filter.exclude"
            ></v-btn>
          </template>
        </v-autocomplete>
      </v-list-item>
    </template>
  </v-card>
  <v-divider v-if="!$vuetify.display.mdAndUp" class="mt-2"></v-divider>
</template>
