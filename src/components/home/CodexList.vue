<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import {
  mdiArrowDown,
  mdiArrowUp,
  mdiCheckboxMarkedCircleOutline,
  mdiMagnify,
  mdiRestore,
  mdiSort,
} from '@mdi/js'
import { getSortName } from '@/utils'
import { useSortState } from '@/stores/sort'
import { useEntriesListState } from '@/stores/entriesList'
import PrimarySortMenu from '@/components/shared/PrimarySortMenu.vue'
import SortMenu from '@/components/home/SortMenu.vue'
import EntryListItem from './EntryListItem.vue'
import CodexPagination from './CodexPagination.vue'

const settings = useSettingsStore()

const sortState = useSortState()
const entriesListState = useEntriesListState()

watch(
  () => entriesListState.entries,
  () => {
    entriesListState.reset()
  },
  { immediate: true },
)

watch(
  () => settings.value.display.page,
  () => {
    entriesListState.reset()
  },
)
</script>

<template>
  <v-card class="border-md">
    <v-list-item class="pa-2" density="compact" slim>
      <div class="d-flex flex-wrap ga-1 justify-end">
        <PrimarySortMenu v-model:primary="sortState.primary">
          <template v-slot:activator="{ activator }">
            <v-chip
              v-bind="activator"
              :text="entriesListState.length"
              :prepend-icon="mdiCheckboxMarkedCircleOutline"
              rounded="lg"
              variant="tonal"
              color="success"
            />
          </template>
        </PrimarySortMenu>

        <v-chip
          :text="$t('meta.' + sortState.primarySort.key)"
          v-if="sortState.primary !== 'default'"
          rounded="lg"
          variant="tonal"
          color="tertiary"
        >
          <template v-slot:append>
            <v-icon :icon="sortState.primarySort.asc ? mdiArrowUp : mdiArrowDown"></v-icon>
          </template>
        </v-chip>

        <v-spacer />

        <div class="d-flex flex-wrap ga-1">
          <SortMenu>
            <template v-slot:activator="{ activator }">
              <v-chip
                :prepend-icon="mdiSort"
                color="secondary"
                rounded="lg"
                :text="sortState.active ? getSortName(sortState.key) : $t('sorts.title')"
                v-bind="activator"
              >
              </v-chip>
            </template>
          </SortMenu>

          <v-btn
            variant="tonal"
            :icon="sortState.asc ? mdiArrowUp : mdiArrowDown"
            size="small"
            rounded="lg"
            color="secondary"
            @click="sortState.asc = !sortState.asc"
          />

          <v-btn
            variant="tonal"
            :icon="mdiRestore"
            size="small"
            color="error"
            rounded="lg"
            @click="sortState.$reset"
          />
        </div>
      </div>
    </v-list-item>
  </v-card>

  <template v-if="settings.display.page">
    <template v-if="entriesListState.length > 0">
      <div class="d-flex flex-wrap flex-column ga-1 pt-2">
        <EntryListItem
          v-for="key in entriesListState.pageEntries"
          :key="key"
          :entry-key="key"
          v-memo="[key]"
        />
      </div>
      <div class="position-sticky pt-8 d-flex justify-center" style="bottom: 28px">
        <CodexPagination v-model:page="entriesListState.page" :pages="entriesListState.pageCount" />
      </div>
    </template>
    <template v-else>
      <v-empty-state class="pt-2" :icon="mdiMagnify" :title="$t('helper.notFound')" />
    </template>
  </template>

  <template v-else>
    <v-infinite-scroll :itens="entriesListState.list" @load="entriesListState.load">
      <div class="d-flex flex-wrap flex-column ga-1 pt-2">
        <template v-for="key in entriesListState.list" :key="key">
          <EntryListItem :entry-key="key" />
        </template>
      </div>
    </v-infinite-scroll>
  </template>
</template>
