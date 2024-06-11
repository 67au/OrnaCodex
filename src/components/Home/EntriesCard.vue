<script setup lang="ts">
import { useCodexState } from '@/stores/codex';
import { useEntriesListState } from '@/stores/entriesList';
import { useFiltersState } from '@/stores/filters';
import { enterCodex, getStaticUrl, getTierName } from '@/plugins/utils';
import { rarityAura, rarityText } from '@/plugins/utils';
</script>

<template>
  <var-card class="card">
    <template #title>
      <var-space justify="flex-end">
        <var-chip size="small" :round="false">
          <template #left>
            <div class="i-mdi-magnify text-md"></div>
          </template>
          {{ codexState.sorted.length }}
        </var-chip>
      </var-space>
    </template>
    <template #description>
      <div class="card-description">
        <var-list :finished="entriesListState.finished" v-model:loading="entriesListState.loading"
          @load="entriesListState.load" :offset="800">
          <var-cell v-for="{ category, id }, index in entriesListState.entries" class="entry-cell" border
            @click="() => enterCodex(category, id)" :key="index">
            <template #icon>
              <var-icon :class="`append-icon ${rarityAura(category, id)}`" :size="48"
                :name="getStaticUrl(codexState.meta[category][id]['icon'])" />
            </template>

            <var-space align="center" size="small">
              <span>
                {{ codexState.lang[category][id]['name'] }}
              </span>
              <var-chip v-if="category === 'items' || category === 'followers'" size="mini" plain
                :class="rarityText(category, id)">
                {{ $t(`meta.rarity.${codexState.meta[category][id]['rarity']}`) }}
              </var-chip>
            </var-space>

            <template #description>
              <var-space size="mini" class="line-height-tight">
                <var-chip type="warning" size="mini" :round="false" plain>
                  {{ getTierName(codexState.meta[category][id]['tier']) }}
                </var-chip>
                <var-chip type="primary" size="mini" :round="false" plain>
                  {{ $t(`categories.${category}`) }}
                </var-chip>

                <var-chip v-if="codexState.meta[category][id]['exotic'] === true" class="exotic" size="mini"
                  :round="false" plain>
                  {{ $t('exotic') }}
                </var-chip>

                <template v-if="codexState.meta[category][id]['event'] != undefined">
                  <var-chip class="highlight" size="mini" :round="false" plain
                    v-for="event in codexState.meta[category][id]['event']" :key="event">
                    <span>{{ $t(`meta.event.${event}`) }}</span>
                  </var-chip>
                </template>

                <template
                  v-if="filtersState.sort !== undefined && codexState.meta[category][id]['stats'] !== undefined && codexState.meta[category][id]['stats'][filtersState.sort] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain>
                    <template v-if="typeof codexState.meta[category][id]['stats'][filtersState.sort] === 'string'">
                      {{ `${$t(`meta.stats.${filtersState.sort}`)}:
                      ${codexState.meta[category][id]['stats'][filtersState.sort]}` }}
                    </template>
                    <template v-else>
                      {{ $t(`meta.stats.${filtersState.sort}`) }}
                    </template>
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
  computed: {
    codexState() {
      return useCodexState()
    },
    filtersState() {
      return useFiltersState()
    },
    entriesListState() {
      return useEntriesListState()
    }
  },
})
</script>

<style>
.entry-cell {
  min-height: 64px;
  padding: 3px 0px;
  --cell-border-left: 6px;
  --cell-border-right: 6px;
}
</style>
<style src="@/styles/color.less" lang="less" />
