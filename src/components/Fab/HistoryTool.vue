<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex';
import { enterCodex, rarityAura, getStaticUrl } from '@/plugins/utils';
import { useHistoryState } from '@/stores/history';

</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)" safe-area>
    <var-paper class="popup">
      <var-space align="center" justify="space-between" size="large" class="pb-3" line>
        <span class="text-xl">{{ $t('history') }}</span>
        <var-space align="center" justify="flex-end" size="mini" line>
          <var-button type="danger" size="small" icon-container @click="$emit('update:show', false)">
            {{ $t('close') }}
          </var-button>
        </var-space>
      </var-space>
      <div class="var-elevation--4 entries" v-if="historyState.history.length > 0">
        <var-cell class="e-cell" border v-for="entry, index in historyState.history" @click="enter(entry)" :key="index">
          <template #icon>
            <var-icon :class="`append-icon ${rarityAura(entry.category, entry.id)}`" :size="36"
              :name="getStaticUrl(entry.meta.icon)" />
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
    </var-paper>
  </var-popup>

</template>

<script lang="ts">
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
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
.popup {
  border-radius: 16px;
  max-width: 320px;
  width: 90vw;
  padding: 12px 12px;
}

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