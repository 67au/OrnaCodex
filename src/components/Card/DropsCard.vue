<script setup lang="ts">
import { store, global } from '@/store'
import ItemList from '@/components/List/ItemList.vue'
import TextLists from '@/components/List/TextLists.vue';
import ChanceLists from '@/components/List/ChanceLists.vue';
import { defineComponent } from 'vue';
</script>

<template>
  <template v-if="store.codex.usedItem[name] !== undefined || store.codex.basedItem[name] !== undefined">
    <var-card class="card" :title="$t(name)">
      <template #description>
        <div class="card-description">
          <template v-if="text">
            <TextLists :codex="store.codex.basedItem[name]" />
          </template>
          <template v-else-if="chance">
            <ChanceLists :codex="store.codex.usedItem[name]" />
          </template>
          <template v-else>
            <template v-for="[category, id] in store.codex.usedItem[name]">
              <!-- check exist -->
              <template v-if="store.codex.used[category][id] !== undefined">
                <ItemList :codex="store.codex.used[category][id]" :click="() => store.enterCodex(category, id)" :key="id"/>
              </template>
              <template v-else-if="store.codex.isMissEntry(`${category}/${id}`)">
                <var-cell class="codex-cell" border :key="id">
                  <template #icon>
                    <var-icon class="append-icon" :size="36" :name="store.getStaticUrl(store.codex.getMissEntry(`${category}/${id}`)['icon'])" />
                  </template>
                  <var-link type="primary" :href="`${global.ornaUrl}/codex/${category}/${id}/`" target="_blank">
                    {{ store.codex.getMissEntry(`${category}/${id}`)['name'] }}
                  </var-link>
                  <br>
                  <var-chip type="danger" size="mini" :round="false" plain>
                    <template #left>
                      <var-icon name="alert-circle-outline" size="12" />
                    </template>
                    {{ $t('notfound') }}
                  </var-chip>
                </var-cell>
              </template>
              <template v-else>
                <var-cell class="codex-cell" border :key="id">
                  <var-link type="primary" :href="`${global.ornaUrl}/codex/${category}/${id}/`" target="_blank">
                    {{ $t('notfound') }}
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

<script lang="ts">
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
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
})
</script>