<script setup lang="ts">
import { useEntriesListState } from '@/stores/entriesList'
import { useSortState } from '@/stores/sort'
import { mdiRestart, mdiSortAscending, mdiSortDescending, mdiViewGrid } from '@mdi/js'
import SortEditor from './SortEditor.vue'
import PrimarySortEditor from './PrimarySortEditor.vue'
import CodexListCard from './CodexListCard.vue'
import CodexListItem from './CodexListItem.vue'
import { settingsStorage } from '@/storages/settings'

const entriesListState = useEntriesListState()
const sortState = useSortState()
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
    <template v-if="settingsStorage.displayCard">
      <v-infinite-scroll :items="entriesListState.entires" @load="entriesListState.load">
        <template v-for="entry in entriesListState.entires" :key="entry.url">
          <CodexListCard class="mt-2" :entry="entry"></CodexListCard>
        </template>
      </v-infinite-scroll>
    </template>
    <template v-else>
      <v-sheet border="md" rounded="lg" class="my-2">
        <v-infinite-scroll :items="entriesListState.entires" @load="entriesListState.load">
          <template v-for="entry in entriesListState.entires" :key="entry.id">
            <CodexListItem :entry="entry"></CodexListItem>
          </template>
        </v-infinite-scroll>
      </v-sheet>
    </template>
  </v-sheet>
</template>
