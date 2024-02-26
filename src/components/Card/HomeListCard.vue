<script setup>
import { watch } from 'vue';
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
          <template v-for="[category, id] in store.list.content">
            <var-cell class="item-cell" border @click="() => store.enterCodex(category, id)">
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
                      v-for="event in store.codex.used[category][id]['event']">
                      <span class="event">{{ event }}</span>
                    </var-chip>
                  </template>
                </var-space>
              </template>
            </var-cell>
          </template>
        </var-list>
      </div>
    </template>
  </var-card>
</template>

<script>
export default {

}
</script>

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