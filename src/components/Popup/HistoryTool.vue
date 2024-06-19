<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { enterCodex, rarityAura, getStaticUrl } from '@/plugins/utils'
import { useHistoryState } from '@/stores/history'
</script>

<template>
  <PopupPaper :show="show" @update:show="$emit('update:show', $event)" max-width="md">
    <template #title>
      <var-chip class="text-md" type="default" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-history" />
        </template>
        <div>{{ $t('history') }}</div>
      </var-chip>
    </template>
    <template #button>
      <PopupButton type="warning" icon-class="i-mdi-trash" @click="historyState.reset()" />
    </template>
    <div class="var-elevation--3 entries mt-3" v-if="historyState.history.length > 0">
      <var-cell
        class="e-cell"
        border
        v-for="(entry, index) in historyState.history"
        @click="enter(entry)"
        :key="index"
      >
        <template #icon>
          <var-icon
            :class="`append-icon ${rarityAura(entry.category, entry.id)}`"
            :size="36"
            :name="getStaticUrl(entry.meta.icon)"
          />
        </template>

        {{ entry.lang.name }}

        <template #description>
          <var-space size="mini" class="line-height-tight">
            <var-chip type="warning" size="mini" :round="false" plain>
              {{ entry.tier }}
            </var-chip>
            <var-chip type="primary" size="mini" :round="false" plain>
              {{ $t(`categories.${entry.category}`) }}
            </var-chip>
          </var-space>
        </template>
      </var-cell>
    </div>
    <div class="text-center py-4" v-else>
      {{ $t('notfound') }}
    </div>
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
    historyState() {
      return useHistoryState()
    }
  },
  methods: {
    enter(entry: CodexEntry) {
      enterCodex(entry.category, entry.id)
      this.$emit('update:show', false)
    }
  }
})
</script>

<style lang="less">
.e-cell {
  margin: 0 auto;
  padding: 3px 0px;
  min-height: 44px;
  width: 95%;
  --cell-border-left: 6px;
  --cell-border-right: 6px;
}

.entries {
  max-height: 65vh;
  overflow-y: auto;
  padding: 8px 2px;
}
</style>
