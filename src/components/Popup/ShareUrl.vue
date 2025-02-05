<script setup lang="ts">
import { serialize } from '@/plugins/filters';
import { utoa } from '@/plugins/utils'
import { useFiltersState } from '@/stores/filters'
import { useSortState } from '@/stores/sort'
</script>

<template>
  <PopupPaper :show="show" max-width="md" @update:show="$emit('update:show', $event)">
    <template #title>
      <var-chip class="text-md" type="info" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-share-variant text-lg" />
        </template>
        <div>{{ $t('share') }}</div>
      </var-chip>
    </template>
    <var-row justify="center" class="px-1">
      <var-col :span="24">
        <var-input
          variant="outlined"
          size="small"
          textarea
          readonly
          v-model="link"
          class="w-full py-2"
        />
      </var-col>
      <var-col :span="24">
        <var-button type="primary" block @click="clipboard.copy(link)">
          {{ $t(clipboard.copied.value ? 'copied' : 'copy') }}
        </var-button>
      </var-col>
    </var-row>
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
  computed: {
    clipboard() {
      return useClipboard({ source: this.link })
    },
    link() {
      return `${location.href.split('#')[0]}#/share/${utoa(this.output)}`
    },
    output() {
      return JSON.stringify({
        sort: useSortState().$state,
        filters: serialize(useFiltersState().$state)
      })
    }
  }
})
</script>
