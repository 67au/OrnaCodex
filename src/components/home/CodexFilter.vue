<script setup lang="ts">
import { useFiltersState } from '@/stores/filters'
import {
  mdiChevronRight,
  mdiCog,
  mdiFilterCog,
  mdiMagnify,
  mdiRedo,
  mdiRestore,
  mdiUndo,
} from '@mdi/js'
import FiltersEditor from './FiltersEditor.vue'
import { getIcon, getOptionName, getOptionValueName } from '@/utils'
import { useCodexState } from '@/stores/codex'
import { mapValues } from 'es-toolkit'
import FilterOperatorMenu from './FilterOperatorMenu.vue'
import { cloneDeep } from 'es-toolkit'

const filtersState = useFiltersState()
const codexState = useCodexState()
const options = computed(() =>
  mapValues(codexState.meta.options, (option, key) => {
    return option
      .map((v: string | number) => {
        return {
          title: getOptionValueName(key, v),
          value: v,
          icon: getIcon(key, v),
        }
      })
      .sort((a, b) => {
        if (key === 'tier') {
          return 0
        }
        return a.title.localeCompare(b.title)
      })
  }),
)

const { filters } = storeToRefs(filtersState)
const { history, clear, canRedo, canUndo, undo, redo } = useDebouncedRefHistory(filters, {
  deep: true,
  debounce: 2000,
  capacity: 30,
  clone: cloneDeep,
})

const keySet = new Set(['immunities', 'causes', 'cures', 'gives', 'summons', 'tags', 'abilities'])
function isAllOpKey(key: string) {
  return keySet.has(key)
}

// pinia persisted side effect
watch(
  () => history.value,
  () => {
    clear()
  },
  { once: true },
)
</script>

<template>
  <v-card border="md" elevation="2" class="border-secondary border-md">
    <div class="pa-2 d-flex flex-column ga-2">
      <v-text-field
        :prepend-inner-icon="mdiMagnify"
        persistent-clear
        :label="$t('filters.search')"
        hide-details
        variant="solo-filled"
        single-line
        rounded="lg"
        class="pa-0"
        density="compact"
        v-model="filtersState.search"
        clearable
      >
        <template v-slot:append>
          <div class="d-flex ga-1 ml-n3">
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiCog"
                  color="secondary"
                  variant="tonal"
                  rounded="lg"
                />
              </template>
              <v-list density="compact" rounded="lg">
                <v-list-item v-for="key in filtersState.defaultOptionsKey" :key="key" class="pa-0">
                  <v-switch
                    v-model="filtersState.options[key]"
                    :label="$t('filters.options.' + key)"
                    hide-details
                    density="compact"
                    color="tertiary"
                    class="px-4"
                  />
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              :icon="mdiRestore"
              color="error"
              variant="tonal"
              rounded="lg"
              @click="filtersState.$reset"
            />
          </div>
        </template>
      </v-text-field>
      <div class="d-flex flex-wrap ga-1" v-if="filtersState.activeOptions.length > 0">
        <v-chip
          v-for="key in filtersState.activeOptions"
          :key="key"
          :text="$t('filters.options.' + key)"
          rounded="lg"
          size="small"
          color="default"
        />
      </div>
    </div>

    <v-divider thickness="2" class="mx-2" />

    <div class="pa-2 d-flex flex-wrap ga-1 align-center">
      <FiltersEditor>
        <template v-slot:activator="{ activator: activator }">
          <v-chip
            v-bind="activator"
            :prepend-icon="mdiFilterCog"
            :append-icon="mdiChevronRight"
            :text="$t('filters.title')"
            rounded="lg"
            variant="tonal"
            color="secondary"
          />
        </template>
      </FiltersEditor>

      <v-spacer />

      <div class="d-flex flex-wrap ga-1">
        <v-btn
          :icon="mdiUndo"
          color="secondary"
          variant="plain"
          density="compact"
          :disabled="!canUndo"
          @click="undo"
        />
        <v-divider vertical thickness="2" class="my-1" />
        <v-btn
          :icon="mdiRedo"
          color="secondary"
          variant="plain"
          density="compact"
          :disabled="!canRedo"
          @click="redo"
        />
      </div>
    </div>

    <template v-if="filters.size > 0">
      <v-divider thickness="2" class="mx-2" />
      <div class="py-2 d-flex flex-column ga-2">
        <template v-for="[key, filter] in filters" :key="key">
          <v-autocomplete
            variant="filled"
            density="compact"
            class="px-2"
            hide-details
            :label="getOptionName(key)"
            :items="options[key]"
            v-model="filter.value"
            item-title="title"
            item-value="value"
            clearable
            chips
            closable-chips
            multiple
          >
            <template v-slot:prepend>
              <div class="d-flex align-center mr-n2">
                <FilterOperatorMenu
                  v-model:operator="filters.get(key)!.operator"
                  :all="isAllOpKey(key)"
                />
              </div>
            </template>
            <template v-slot:chip="{ props, item }">
              <v-chip v-bind="props" :text="item.title" rounded="md">
                <template v-if="item.icon !== undefined" v-slot:prepend>
                  <v-icon class="ml-n1 mr-1">
                    <v-img :src="item.icon" class="image-render-pixel" />
                  </v-icon>
                </template>
              </v-chip>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.title">
                <template v-slot:prepend v-if="item.icon !== undefined">
                  <v-icon class="ml-n1 mr-1">
                    <v-img :src="item.icon" class="image-render-pixel" />
                  </v-icon>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </template>
      </div>
    </template>
  </v-card>
</template>
