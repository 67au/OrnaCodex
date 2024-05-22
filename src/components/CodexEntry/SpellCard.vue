<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
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
      return Object.entries(this.ce.spells as Record<string, Array<string>>).flatMap(([category, ids]) => {
        return ids.map((id: string) => new CodexEntry(category, id))
      })
    }
  }
})
</script>