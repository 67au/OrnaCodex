<script setup lang="ts">
import { deserialize as filtersDeserialize } from '@/plugins/filters'
import { global } from '@/plugins/global'
import { atou } from '@/plugins/utils'
import router from '@/router'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
import { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/snackbar/style/index'
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
        const { sort: sort, filters: filters, version: version } = JSON.parse(atou(this.share))
        if (version === global.filtersVersion) {
          this.sortState.$patch(sort)
          this.filtersState.$patch(filtersDeserialize(filters))
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
