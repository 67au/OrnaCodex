<script setup lang="ts">
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
import { mdiRestart, mdiSortAscending, mdiSortDescending, mdiViewGrid } from '@mdi/js'
import SortEditor from './SortEditor.vue'
import PrimarySortEditor from './PrimarySortEditor.vue'
import CodexListCard from './CodexListCard.vue'
import { useWorkerState } from '@/stores/worker'
import { useCodexState } from '@/stores/codex'

const entriesListState = useEntriesListState()
const codexState = useCodexState()
const filtersState = useFiltersState()
const sortState = useSortState()

const workerState = useWorkerState()

entriesListState.codex = workerState.setInit()

watch(
  () => codexState.translation.main,
  () => {
    if (codexState.translation?.main) {
      workerState.setI18n()
    }
  },
  { immediate: true },
)

watch(
  () => workerState.worker.data,
  () => {
    if (workerState.worker.data !== undefined) {
      entriesListState.$patch({
        codex: workerState.worker.data,
      })
      entriesListState.render()
    }
  },
)

filtersState.$subscribe(
  () => {
    workerState.setFilter()
  },
  { immediate: true },
)

sortState.$subscribe(
  () => {
    workerState.setSort()
  },
  { immediate: true },
)
</script>

<template>
  <v-sheet class="mx-auto" color="transparent" rounded="lg">
    <v-sheet class="pa-2" rounded="lg" border="md">
      <div class="d-flex flex-wrap ga-2 justify-end">
        <v-chip :prepend-icon="mdiViewGrid" rounded="lg" :text="entriesListState.length"></v-chip>
        <v-spacer></v-spacer>
        <PrimarySortEditor></PrimarySortEditor>
        <div class="d-flex ga-1 justify-end">
          <SortEditor></SortEditor>
          <v-btn
            variant="tonal"
            :icon="sortState.asc ? mdiSortAscending : mdiSortDescending"
            size="small"
            color="secondary"
            @click="sortState.asc = !sortState.asc"
          ></v-btn>
          <v-btn
            variant="tonal"
            :icon="mdiRestart"
            size="small"
            color="error"
            @click="sortState.$reset"
          ></v-btn>
        </div>
      </div>
    </v-sheet>
    <v-infinite-scroll :items="entriesListState.entires" @load="entriesListState.load">
      <template v-for="entry in entriesListState.entires" :key="entry.id">
        <CodexListCard class="mt-2" :entry="entry"></CodexListCard>
      </template>
    </v-infinite-scroll>
  </v-sheet>
</template>
