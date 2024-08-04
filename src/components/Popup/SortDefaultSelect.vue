<script setup lang="ts">
import { useSortState } from '@/stores/sort'
</script>

<template>
  <PopupPaper :show="show" max-width="md" @update:show="$emit('update:show', $event)">
    <template #title>
      <var-chip class="text-md" type="primary" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-sort text-lg" />
        </template>
        <div>{{ $t('sortDefault') }}</div>
      </var-chip>
    </template>

    <var-divider dashed />

    <var-paper radius="0px" class="overflow-y-auto px-0.5 py-1" style="max-height: 65vh">
      <var-space size="small">
        <var-chip
          :type="sortState.default.name === 'default' ? 'success' : 'default'"
          elevation="3"
          @click="() => editSortDefault()"
        >
          {{ $t('query.qualitylabel.default') }}
        </var-chip>
        <var-chip
          v-for="[name, asc] in [
            ['name', true],
            ['name', false],
            ['tier', true],
            ['tier', false]
          ]"
          :type="
            sortState.default.name === name && sortState.default.asc === asc ? 'success' : 'default'
          "
          elevation="3"
          @click="() => editSortDefault(name as string, asc as boolean)"
        >
          <var-space align="center" size="0" line>
            {{ $t(name as string) }}
            <Icon v-if="asc as boolean" class="text-lg" icon-class="i-mdi-arrow-upward" />
            <Icon v-else class="text-lg" icon-class="i-mdi-arrow-downward" />
          </var-space>
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      expand: false,
      search: ''
    }
  },
  computed: {
    sortState() {
      return useSortState()
    }
  },
  methods: {
    editSortDefault(key: string = 'default', asc: boolean = false) {
      this.$emit('update:show', false)
      setTimeout(() => {
        this.sortState.default.name = key
        this.sortState.default.asc = asc
      }, 50)
    }
  }
})
</script>
