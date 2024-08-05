<script setup lang="ts">
import { atou } from '@/plugins/utils'
import router from '@/router'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
import { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/snackbar/snackbar.css'
</script>

<template></template>

<script lang="ts">
export default defineComponent({
  props: {
    share: {
      type: String
    }
  },
  mounted() {
    Snackbar.allowMultiple(true)
    if (this.share !== undefined) {
      try {
        const { sort: sort, filters: filters } = JSON.parse(atou(this.share))
        if (
          sort.version === this.sortState.version &&
          filters.version === this.filtersState.version
        ) {
          this.sortState.initialize(sort)
          this.filtersState.initialize(filters)
        } else {
          Snackbar({
            content: this.$t('shareVerionError'),
            type: 'error'
          })
        }
        router.push({
          name: 'home',
          query: { share: '1' }
        })
      } catch {
        Snackbar({
          content: this.$t('shareError'),
          type: 'error'
        })
      }
    }
    router.push({ name: 'home' })
  },
  computed: {
    route() {
      return useRoute()
    },
    filtersState() {
      return useFiltersState()
    },
    sortState() {
      return useSortState()
    }
  }
})
</script>
