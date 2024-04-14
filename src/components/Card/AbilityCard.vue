<script setup lang="ts">
import { global, useCodexState, useCodexViewState } from '@/store';
import ItemList from '@/components/List/ItemList.vue';
import { storeToRefs } from 'pinia';
</script>

<template>
  <template v-if="codexViewState.item['ability'] !== undefined">
    <var-card class="card" :title="$t('ability')">
      <template #description>
        <div class="card-description">
          <template v-if="codexViewState.isOffhandItem()">
            <ItemList :codex="offhandSkill" :click="() => global.enterCodex(category, offhandSkillId)"/>
          </template>
          <template v-else>
          <var-cell class="codex-cell" :title="codexViewState.item['ability'][0]"
            :description="codexViewState.item['ability'][1]">
          </var-cell>
        </template>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexViewState = useCodexViewState();
const codexState = useCodexState();
const category: string = 'spells';
export default {
  computed: {
    offhandSkillId() {
      return codexState.extra['offhand_items'][codexViewState.page.id];
    },
    offhandSkill() {
      return codexState.used[category][this.offhandSkillId];
    }
  }
}
</script>