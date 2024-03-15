<script setup lang="ts">
import { global, store } from '@/store';
</script>

<template>
  <template v-if="store.codexPage.category === 'spells' && store.codex.isSkill()">
    <var-card class="card" :title="$t('speller')">
      <template #description>
        <div class="card-description">
          <template v-for="[category, spellers] in Object.entries(store.codex.extra['skills'][store.codexPage.id])">
            <var-cell class="codex-cell" border v-for="sid in spellers" @click="() => store.enterCodex(category, sid)" :key="sid">
              <template #icon>
                <var-icon class="append-icon" :size="36"
                  :name="`${global.staticUrl}${store.codex.used[category][sid]['icon']}`" />
              </template>
              {{ store.codex.based[category][sid]['name'] }}
              <var-chip type="warning" size="mini" :round="true" plain>
              {{ global.star + store.codex.used[category][sid]['tier']}}
                </var-chip>
              <br>
              <var-chip type="primary" size="mini" :round="false" plain>{{
                $t(`categories.${store.codex.used[category][sid]['category']}`) }}</var-chip>
            </var-cell>
          </template>
        </div>
      </template>
    </var-card>
  </template>
</template>
