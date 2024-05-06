<script setup lang="ts">
import { global, useCodexState, useCodexViewState } from '@/store'
</script>

<template>
  <template v-if="codexViewState.page.category === 'spells' && codexViewState.isOffhandSkill()">
    <var-card class="card" :title="$t('offhands')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-small-cell" v-for="aid in codexState.extra['offhand_skills'][codexViewState.page.id]" border
            @click="() => global.enterCodex(category, aid)" :key="aid">
            <template #icon>
              <var-icon class="append-icon" :size="36"
                :name="global.getStaticUrl(codexState.used[category][aid]['icon'])" />
            </template>
            {{ codexState.lang[category][aid]['name'] }}
            <var-chip type="warning" size="mini" :round="true" plain>
              {{ global.getTier(codexState.used[category][aid]['tier']) }}
            </var-chip>
          </var-cell>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const codexState = useCodexState();
const codexViewState = useCodexViewState();
const category = 'items';
</script>