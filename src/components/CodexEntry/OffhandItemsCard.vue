<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
</script>

<template>
  <template v-if="ce.category === 'spells' && ce.offhandItems !== undefined">
    <var-card class="card" :title="$t('offhands')">
      <template #description>
        <div class="card-description">
          <ListEntry v-for="entry in items" :entry="entry" :key="entry.id" />
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
    items(): Array<CodexEntry> {
      return this.ce.offhandItems.map((id: string) => new CodexEntry('items', id))
    }
  }
})
</script>
