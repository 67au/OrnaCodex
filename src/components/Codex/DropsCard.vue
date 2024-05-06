<script setup lang="ts">
import { global, useCodexState, useCodexViewState } from '@/store'
import ItemList from '@/components/List/ItemList.vue'
import TextLists from '@/components/List/TextLists.vue';
import ChanceLists from '@/components/List/ChanceLists.vue';
import { defineComponent } from 'vue';
</script>

<template>
  <template v-if="codexViewState.item[name] !== undefined || codexViewState.item[name] !== undefined">
    <var-card class="card" :title="$t(name)">
      <template #description>
        <div class="card-description">
          <template v-if="text">
            <TextLists :codex="codexViewState.item[name]" />
          </template>
          <template v-else-if="chance">
            <ChanceLists :codex="codexViewState.item[name]" :summons="name === 'summons'"/>
          </template>
          <template v-else>
            <template v-for="[category, id] in codexViewState.item[name]">
              <!-- check exist -->
              <template v-if="codexState.used[category][id] !== undefined">
                <ItemList :codex="codexState.used[category][id]" :click="() => global.enterCodex(category, id)" :key="id"/>
              </template>
              <template v-else-if="codexState.isMissEntry(category, id)">
                <var-cell class="codex-cell" border :key="id">
                  <template #icon>
                    <var-icon class="append-icon" :size="36" :name="global.getStaticUrl(codexState.getMissEntry(category, id)['icon'])" />
                  </template>
                  <var-link type="primary" :href="`${global.ornaUrl}/codex/${category}/${id}/`" target="_blank">
                    {{ codexState.getMissEntry(category, id)['name'] }}
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
const codexState = useCodexState();
const codexViewState = useCodexViewState();

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