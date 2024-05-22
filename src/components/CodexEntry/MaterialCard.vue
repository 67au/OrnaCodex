<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
</script>

<template>
  <template v-if="ce.category === 'items' && ce.materials !== undefined">
    <var-card class="card" :title="$t('materials')">
      <template #description>
        <div class="card-description">
          <ListEntry v-for="entry in materials" :entry="entry" :key="entry.id" />
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
    materials(): Array<CodexEntry> {
      return this.ce.materials.map((id: string) => new CodexEntry('items', id))
    }
  }
})
</script>