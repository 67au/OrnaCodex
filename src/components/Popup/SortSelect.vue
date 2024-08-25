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
        <div>{{ $t('sort') }}</div>
      </var-chip>
    </template>
    <template #button>
      <PopupButton type="info" icon-class="i-mdi-magnify" @click="() => (expand = !expand)" />
    </template>
    <var-collapse-transition :expand="expand">
      <var-input
        class="w-full pt-3 pb-1"
        variant="outlined"
        size="small"
        :placeholder="$t('search')"
        v-model="search"
        clearable
      />
    </var-collapse-transition>

    <var-paper radius="0px" class="overflow-y-auto px-0.5 pb-1" style="max-height: 65vh">
      <template v-for="[k, values] in sortKeys">
        <template v-if="values.length > 0">
          <var-divider :description="$t(`sortKeys.${k}`)" />
          <var-space size="small">
            <var-chip
              :type="sortState.name === `${k}.${v}` ? 'success' : 'default'"
              elevation="3"
              v-for="v in values"
              @click="() => editSort(`${k}.${v}`)"
            >
              {{ $t(`meta.stats.${v}`) }}
            </var-chip>
          </var-space>
        </template>
      </template>
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
    },
    sortKeys() {
      const regex = new RegExp(this.search, 'i')
      return Object.entries(this.sortState.keys).map(([k, v]) => {
        return [
          k,
          Array.from(v).filter((key) => {
            return regex.test(this.$t(`meta.stats.${key}`))
          })
        ]
      })
    }
  },
  methods: {
    editSort(key: string) {
      this.$emit('update:show', false)
      setTimeout(() => {
        this.sortState.name = key
      }, 50)
    }
  }
})
</script>
