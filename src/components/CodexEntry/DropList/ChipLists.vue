<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex'
import { getStaticUrl } from '@/plugins/utils'
import { useCodexState } from '@/stores/codex'
import type { PropType } from 'vue'
</script>

<template>
  <var-space size="small">
    <var-chip size="small" v-for="(entry, index) in entries" :key="index" elevation="2">
      <template #left>
        <var-icon
          class="image-render-pixel m-0.25"
          :size="20"
          :name="getStaticUrl(codexState.icons[entry.name])"
        />
      </template>
      <div>
        <template v-if="name === 'summons'">
          {{ `${$t(`meta.summon.${entry.name}`)} (${entry.chance})` }}
        </template>
        <template v-else>
          <span v-if="entry.chance !== undefined">
            {{ `${$t(`meta.status.${entry.name}`)} (${entry.chance})` }}
          </span>
          <span v-else>
            {{ `${$t(`meta.status.${entry.name}`)}` }}
          </span>
        </template>
      </div>
    </var-chip>
  </var-space>
</template>

<script lang="ts">
export default {
  props: {
    entries: {
      type: Object as PropType<CodexEntry>
    },
    name: {
      type: String
    }
  },
  computed: {
    codexState() {
      return useCodexState()
    }
  }
}
</script>
