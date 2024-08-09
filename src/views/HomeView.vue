<script setup lang="ts">
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import FiltersCard from '@/components/Home/FiltersCard.vue'
import EntriesCard from '@/components/Home/EntriesCard.vue'
import { useSortState } from '@/stores/sort'
import router from '@/router'
</script>

<template>
  <var-sticky :offset-top="64" css-mode :disabled="disableSticky" class="hack-warp">
    <FiltersCard />
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
    },
    filtersState() {
      return useFiltersState()
    },
    sortState() {
      return useSortState()
    },
    route() {
      return useRoute()
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }

    const entriesListState = useEntriesListState()
    const filtersStorage = useLocalStorage('filters', JSON.stringify(this.filtersState.storage))
    const sortStorage = useLocalStorage('sort', JSON.stringify(this.sortState.$state))

    const saveFilters = useDebounceFn(
      () => {
        filtersStorage.value = JSON.stringify(this.filtersState.storage)
      },
      500,
      { maxWait: 1000 }
    )

    const saveSort = useDebounceFn(
      () => {
        sortStorage.value = JSON.stringify(this.sortState.$state)
      },
      500,
      { maxWait: 1000 }
    )

    if (this.route.query?.share === '1') {
      router.replace({ name: 'home' })
    } else {
      this.filtersState.initialize(JSON.parse(filtersStorage.value))
      this.sortState.initialize(JSON.parse(sortStorage.value))
    }

    watch(
      () => this.filtersState.multiple,
      () => {
        this.filtersState.switchMultiple()
      }
    )

    this.filtersState.$subscribe(
      () => {
        saveFilters()
        entriesListState.render()
      },
      { deep: true, immediate: true }
    )

    this.sortState.$subscribe(
      () => {
        saveSort()
        entriesListState.render()
      },
      { deep: true, immediate: true }
    )

    watch(
      () => this.$i18n.locale,
      () => {
        this.filtersState.search = ''
        entriesListState.render()
      }
    )
  }
})
</script>
