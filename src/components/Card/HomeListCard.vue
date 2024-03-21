<script setup lang="ts">
import { store, global } from '@/store';
</script>

<template>
  <var-card class="card">
    <template #title>
      <var-space justify="flex-end">
        <var-chip size="small" :round="false">
          <template #left>
            <var-icon name="magnify" size="16" />
          </template>
          {{ store.codex.filtered.length }}
        </var-chip>
      </var-space>
    </template>

    <template #description>
      <div class="card-description">
        <var-list :finished="store.list.finished" v-model:loading="store.list.loading" @load="store.loadList"
          :offset="800">
          <var-cell v-for="[category, id], index in store.list.content" class="item-cell" border
            @click="() => store.enterCodex(category, id)" :key="index">
            <template #icon>
              <var-icon :class="`append-icon ${rarityAura(category, id)}`" :size="48"
                :name="store.getStaticUrl(store.codex.used[category][id]['icon'])" />
            </template>

            <span>
              {{ store.codex.based[category][id]['name'] }}
            </span>

            <template #description>
              <var-space size="mini" style="line-height: 120%;">
                <var-chip type="warning" size="mini" :round="false" plain>
                  {{ global.star + store.codex.used[category][id]['tier'] }}
                </var-chip>
                <var-chip type="primary" size="mini" :round="false" plain>
                  {{ $t(`categories.${category}`) }}
                </var-chip>
                <var-chip v-if="store.codex.used[category][id]['rarity'] !== undefined" size="mini" :round="false" plain
                  :class="rarityText(category, id)">
                  {{ $t(`meta.rarity.${store.codex.used[category][id]['rarity']}`) }}
                </var-chip>

                <var-chip v-if="store.codex.used[category][id]['exotic'] === true" class="exotic" size="mini" :round="false" plain>
                  {{ $t('exotic') }}
                </var-chip>

                <template v-if="store.codex.used[category][id]['event'] != undefined">
                  <var-chip class="highlight" size="mini" :round="false" plain
                    v-for="event in store.codex.used[category][id]['event']" :key="event">
                    <span>{{ $t(`meta.event.${event}`) }}</span>
                  </var-chip>
                </template>

                <template
                  v-if="global.sortKeysSet.has(store.sort) && store.codex.used[category][id]['stats'] !== undefined && store.codex.used[category][id]['stats'][store.sort] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain>
                    {{ `${$t(`meta.stats.${store.sort}`)}: ${store.codex.used[category][id]['stats'][store.sort]}` }}
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
export default defineComponent({
  methods: {
    rarityAura(category: string, id: string) {
      const usedItem = store.codex.used[category][id];
      if (category === 'items') {
        return usedItem['aura'];
      }
      if (category === 'followers') {
        return global.rarityAura[usedItem['rarity']];
      }
      return ''
    },
    rarityText(category: string, id: string) {
      const usedItem = store.codex.used[category][id];
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
