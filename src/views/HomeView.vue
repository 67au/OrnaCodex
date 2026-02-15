<script setup lang="ts">
import CodexFilter from '@/components/home/CodexFilter.vue'
import CodexList from '@/components/home/CodexList.vue'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
import { useQueryState } from '@/stores/query'

const queryState = useQueryState()
const filtersState = useFiltersState()
const sortState = useSortState()

filtersState.$subscribe(() => {
  queryState.queryWorker.handleQuery()
})

sortState.$subscribe(() => {
  queryState.queryWorker.handleQuery()
})
</script>

<template>
  <v-container class="pa-2 d-flex flex-wrap ga-2" :max-width="900">
    <v-row :gap="8" class="mx-auto">
      <v-col cols="12">
        <CodexFilter />
      </v-col>
      <v-col cols="12">
        <CodexList />
      </v-col>
    </v-row>
  </v-container>
</template>
