<script setup lang="ts">
import { global, useCodexState, useCodexViewState } from '@/store';
</script>

<template>
  <template v-if="codexViewState.page.category === 'spells' && codexViewState.isSkill()">
    <var-card class="card" :title="$t('speller')">
      <template #description>
        <div class="card-description">
          <template v-for="[category, spellers] in Object.entries(codexState.extra['skills'][codexViewState.page.id])">
            <var-cell class="codex-cell" border v-for="sid in spellers" @click="() => global.enterCodex(category, sid)" :key="sid">
              <template #icon>
                <var-icon class="append-icon" :size="36"
                  :name="global.getStaticUrl(codexState.used[category][sid]['icon'])" />
              </template>
              {{ codexState.lang[category][sid]['name'] }}
              <var-chip type="warning" size="mini" :round="true" plain>
              {{ global.getTier(codexState.used[category][sid]['tier'])}}
                </var-chip>
              <br>
              <var-chip type="primary" size="mini" :round="false" plain>{{
                $t(`categories.${codexState.used[category][sid]['category']}`) }}</var-chip>
            </var-cell>
          </template>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexState = useCodexState();
const codexViewState = useCodexViewState();
</script>