<script setup lang="ts">
import { global, useCodexState, useFiltersState, useItemListState } from '@/store';
</script>

<template>
  <var-card class="card">
    <template #title>
      <var-space justify="flex-end">
        <var-chip size="small" :round="false">
          <template #left>
            <var-icon name="magnify" size="16" />
          </template>
          {{ codexState.filtered.length }}
        </var-chip>
      </var-space>
    </template>

    <template #description>
      <div class="card-description">
        <var-list :finished="itemListState.finished" v-model:loading="itemListState.loading" @load="itemListState.load"
          :offset="800">
          <var-cell v-for="{ category, id }, index in itemListState.items" class="item-cell" border
            @click="() => global.enterCodex(category, id)" :key="index">
            <template #icon>
              <var-icon :class="`append-icon ${rarityAura(category, id)}`" :size="48"
                :name="global.getStaticUrl(codexState.used[category][id]['icon'])" />
            </template>

            <var-space align="center" size="small">
              <span>
                {{ codexState.lang[category][id]['name'] }}
              </span>
              <var-chip v-if="category === 'items' || category === 'followers'" size="mini" plain
                :class="rarityText(category, id)">
                {{ $t(`meta.rarity.${codexState.used[category][id]['rarity']}`) }}
              </var-chip>
            </var-space>

            <template #description>
              <var-space size="mini" style="line-height: 120%;">
                <var-chip type="warning" size="mini" :round="false" plain>
                  {{ global.getTier(codexState.used[category][id]['tier']) }}
                </var-chip>
                <var-chip type="primary" size="mini" :round="false" plain>
                  {{ $t(`categories.${category}`) }}
                </var-chip>

                <var-chip v-if="codexState.used[category][id]['exotic'] === true" class="exotic" size="mini"
                  :round="false" plain>
                  {{ $t('exotic') }}
                </var-chip>

                <template v-if="codexState.used[category][id]['event'] != undefined">
                  <var-chip class="highlight" size="mini" :round="false" plain
                    v-for="event in codexState.used[category][id]['event']" :key="event">
                    <span>{{ $t(`meta.event.${event}`) }}</span>
                  </var-chip>
                </template>

                <template
                  v-if="filtersState.sort !== undefined && codexState.used[category][id]['stats'] !== undefined && codexState.used[category][id]['stats'][filtersState.sort] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain>
                    {{ `${$t(`meta.stats.${filtersState.sort}`)}:
                    ${codexState.used[category][id]['stats'][filtersState.sort]}` }}
                  </var-chip>
                </template>
              </var-space>
            </template>
          </var-cell>
        </var-list>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
const codexState = useCodexState();
const filtersState = useFiltersState();
const itemListState = useItemListState();

export default defineComponent({
  methods: {
    rarityAura(category: string, id: string) {
      const usedItem = codexState.used[category][id];
      if (category === 'items') {
        return usedItem['aura'];
      }
      if (category === 'followers') {
        return global.rarityAura[usedItem['rarity']];
      }
      return ''
    },
    rarityText(category: string, id: string) {
      const usedItem = codexState.used[category][id];
      if (category === 'items') {
        return `${usedItem['aura']}-text`
      }
      if (category === 'followers') {
        return `${global.rarityAura[usedItem['rarity']]}-text`;
      }
      return ''
    }
  }
})
</script>

<style src="@/styles/color.less" lang="less" />
