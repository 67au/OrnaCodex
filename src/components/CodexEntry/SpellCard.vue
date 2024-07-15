<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
import type { CodexCategory } from '@/types'
</script>

<template>
  <template v-if="ce.category === 'spells' && ce.spells !== undefined">
    <var-card class="card" :title="$t('speller')">
      <template #description>
        <div class="card-description">
          <ListEntry v-for="entry in spells" :entry="entry" :key="entry.id" />
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  computed: {
    ce() {
      return this.view as CodexEntry
    },
    spells(): Array<CodexEntry> {
      return (this.ce.spells as Array<[CodexCategory, string]>).map(
        ([category, id]) => new CodexEntry(category, id)
      )
    }
  }
})
</script>
