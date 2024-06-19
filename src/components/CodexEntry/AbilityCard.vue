<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex'
</script>

<template>
  <template v-if="ce.meta.ability !== undefined">
    <var-card class="card" :title="$t('ability')">
      <template #description>
        <div class="card-description">
          <template v-if="ability.meta !== undefined">
            <ListEntry :entry="ability" />
          </template>
          <template v-else>
            <!-- worng -->
            <var-cell
              class="text-cell"
              :title="ce.lang.ability[0]"
              :description="ce.lang.ability[1]"
            >
            </var-cell>
          </template>
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
    ability() {
      return new CodexEntry(this.ce.meta.ability[0], this.ce.meta.ability[1])
    }
  }
})
</script>
