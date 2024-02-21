<script setup>
import { store } from '@/store'
import ItemList from '@/components/Card/List/ItemList.vue'
import TextLists from '@/components/Card/List/TextLists.vue';
import ChanceLists from '@/components/Card/List/ChanceLists.vue';
</script>

<template>
  <template v-if="store.codex.usedItem[name] !== undefined">
      <var-card class="card" :title="$t(name)">
        <template #description>
          <div class="card-description">
            <template v-if="text">
              <TextLists :codex="store.codex.usedItem[name]" />
            </template>
            <template v-else-if="chance">
              <ChanceLists :codex="store.codex.usedItem[name]" />
            </template>
            <template v-else>
              <template v-for="[category, id] in store.codex.usedItem[name]">
                <ItemList :codex="store.codex.used[category][id]" :click="() => store.enterCodex(category, id)" />
              </template>
            </template>
          </div>
        </template>
      </var-card>
  </template>
</template>

<script>
export default {
  mounted() {
  },
  props: {
    name: {
      type: String,
    },
    text: {
      type: Boolean,
      default: false
    },
    chance: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  }
}
</script>