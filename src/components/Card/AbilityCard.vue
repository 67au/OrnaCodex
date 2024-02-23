<script setup>
import { store } from '@/store';
import ItemList from '@/components/Card/List/ItemList.vue';
</script>

<template>
  <template v-if="store.codex.usedItem['ability'] !== undefined">
    <var-card class="card" :title="$t('ability')">
      <template #description>
        <div class="card-description">
          <template v-if="store.codex.isOffhandItem()">
            <ItemList :codex="offhandSkill" :click="() => store.enterCodex(category, offhandSkillId)"/>
          </template>
          <template v-else>
          <var-cell class="codex-cell" :title="store.codex.usedItem['ability'][0]"
            :description="store.codex.usedItem['ability'][1]">
          </var-cell>
        </template>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script>
const category = 'spells';
export default {
  computed: {
    offhandSkill() {
      return store.codex.used[category][this.offhandSkillId];
    },
    offhandSkillId() {
      return store.codex.data['offhand_items'][store.codexPage.id];
    }
  }
}
</script>