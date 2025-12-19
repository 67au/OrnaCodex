<script setup lang="ts">
import AppSlideMenu from '@/components/AppSlideMenu.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CodexFilter from '@/components/Codex/CodexFilter.vue'
import CodexList from '@/components/Codex/CodexList.vue'
import AppBackTop from '@/components/AppBackTop.vue'
import { useCodexState } from '@/stores/codex'
import { useWorkerState } from '@/stores/worker'
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'

const codexState = useCodexState()
const workerState = useWorkerState()
const entriesListState = useEntriesListState()
const filtersState = useFiltersState()
const sortState = useSortState()

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
  <DefaultLayout :title="$t('title')">
    <template v-slot:slide>
      <AppSlideMenu></AppSlideMenu>
    </template>
    <template v-slot:tools>
      <AppBackTop></AppBackTop>
    </template>
    <v-container fluid class="px-2 mx-auto" :max-width="900" id="home-scroll">
      <v-row dense>
        <v-col cols="12">
          <CodexFilter></CodexFilter>
        </v-col>
        <v-col cols="12">
          <CodexList></CodexList>
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>
