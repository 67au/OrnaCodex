<script setup lang="ts">
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import FilterCard from '@/components/Home/FilterCard.vue'
import EntriesCard from '@/components/Home/EntriesCard.vue'
import { useSortState } from '@/stores/sort'
</script>

<template>
  <var-sticky :offset-top="64" css-mode :disabled="disableSticky" class="hack-warp">
    <FilterCard />
  </var-sticky>
  <EntriesCard />
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    disableSticky() {
      return this.windowWidth < 768
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }

    const filtersState = useFiltersState()
    const sortState = useSortState()
    const entriesListState = useEntriesListState()
    const filtersStorage = useLocalStorage('filters', JSON.stringify(filtersState.$state))
    filtersState.initialize(JSON.parse(filtersStorage.value))
    const sortStorage = useLocalStorage('sort', JSON.stringify(sortState.$state))
    sortState.initialize(JSON.parse(sortStorage.value))

    watch(
      () => filtersState.multiple,
      () => {
        filtersState.switchMultiple()
      }
    )

    const saveFilters = useDebounceFn(
      () => {
        filtersStorage.value = JSON.stringify(filtersState.$state)
      },
      500,
      { maxWait: 1000 }
    )

    const saveSort = useDebounceFn(
      () => {
        sortStorage.value = JSON.stringify(sortState.$state)
      },
      500,
      { maxWait: 1000 }
    )

    filtersState.$subscribe(
      () => {
        saveFilters()
        entriesListState.render()
      },
      { deep: true, immediate: true }
    )

    sortState.$subscribe(
      () => {
        saveSort()
        entriesListState.render()
      },
      { deep: true, immediate: true }
    )

    watch(
      () => this.$i18n.locale,
      () => {
        filtersState.search = ''
        entriesListState.render()
      }
    )
  }
})
</script>
