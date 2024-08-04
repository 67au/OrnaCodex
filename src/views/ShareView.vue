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
    if (this.share !== undefined) {
      try {
        const { sort: sort, filters: filters } = JSON.parse(atou(this.share))
        this.filtersState.initialize(filters)
        this.sortState.initialize(sort)
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
