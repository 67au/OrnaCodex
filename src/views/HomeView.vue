<script setup lang="ts">
import { useEntriesListState } from '@/stores/entriesList'
import { useFiltersState } from '@/stores/filters'
import FiltersCard from '@/components/Home/FiltersCard.vue'
import EntriesCard from '@/components/Home/EntriesCard.vue'
import { useSortState } from '@/stores/sort'
import router from '@/router'
import { useOptionsState } from '@/stores/options'
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
    const optionState = useOptionsState()

    optionState.initialize()

    if (this.route.query?.share === '1') {
      router.replace({ name: 'home' })
    } else {

    }

    this.filtersState.$subscribe(
      () => {
        entriesListState.render()
      },
      { deep: true, immediate: true }
    )

    this.sortState.$subscribe(
      () => {
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
