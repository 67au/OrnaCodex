<script setup lang="ts">
import { global, useCodexState } from '@/store';
import ItemList from '@/components/List/ItemList.vue';
import { storeToRefs } from 'pinia';
</script>

<template>
  <template v-if="codexState.usedItem['ability'] !== undefined">
    <var-card class="card" :title="$t('ability')">
      <template #description>
        <div class="card-description">
          <template v-if="codexState.isOffhandItem()">
            <ItemList :codex="offhandSkill" :click="() => global.enterCodex(category, offhandSkillId)"/>
          </template>
          <template v-else>
          <var-cell class="codex-cell" :title="codexState.usedItem['ability'][0]"
            :description="codexState.usedItem['ability'][1]">
          </var-cell>
        </template>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexState = useCodexState();
const category: string = 'spells';
const { extra, used } = storeToRefs(codexState);
export default {
  computed: {
    offhandSkillId() {
      return extra.value['offhand_items'][codexState.page.id];
    },
    offhandSkill() {
      return (used.value as any)[category][this.offhandSkillId];
    }
  }
}
</script>