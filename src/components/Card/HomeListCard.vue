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
              <var-icon class="append-icon" :size="48"
                :name="`${global.staticUrl}${store.codex.used[category][id]['icon']}`" />
            </template>

            <template #description>
              {{ store.codex.used[category][id]['name'] }}
              <br>
              <var-space size="mini" style="line-height: 120%;">
                <var-chip type="warning" size="mini" :round="false" plain>{{ global.star +
          store.codex.used[category][id]['tier']
                  }}</var-chip>
                <var-chip type="primary" size="mini" :round="false" plain>{{
          $t(`categories.${store.codex.used[category][id]['category']}`) }}</var-chip>
                <template v-if="store.codex.used[category][id]['event'] != undefined">
                  <var-chip class="highlight" size="mini" :round="false" plain
                    v-for="event in store.codex.used[category][id]['event']" :key="event">
                    <span class="event">{{ event }}</span>
                  </var-chip>
                </template>

                <template
                  v-if="global.sortKeysSet.has(store.sort) && store.codex.used[category][id]['stats'] !== undefined && store.codex.used[category][id]['stats'][store.sort] !== undefined">
                  <var-chip type="info" size="mini" :round="false" plain>
                    {{ `${$t('stat_key.' + store.sort)}: ${store.codex.used[category][id]['stats'][store.sort]}` }}
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

<style scoped>
.event {
  padding-top: 5px;
  max-width: 190px;
  width: max-content;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>