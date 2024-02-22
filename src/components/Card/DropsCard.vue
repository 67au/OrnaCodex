<script setup>
import { store, global } from '@/store'
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
              <!-- check exist -->
              <template v-if="store.codex.used[category][id] !== undefined">
                <ItemList :codex="store.codex.used[category][id]" :click="() => store.enterCodex(category, id)" />
              </template>
              <template v-else>
                <var-cell class="codex-cell" border>
                  {{ $t('notfound') }}
                  <br>
                  <var-link type="primary" :href="`${global.ornaUrl}/codex/${category}/${id}/`" target="_blank">
                    {{ `${global.ornaUrl}/codex/${category}/${id}/` }}
                  </var-link>
                </var-cell>
              </template>
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