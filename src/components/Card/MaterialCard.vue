<script setup lang="ts">
import { global, useCodexState, useCodexViewState } from '@/store'
</script>

<template>
  <template v-if="codexViewState.page.category === 'items' && codexViewState.isMaterial()">
    <var-card class="card" :title="$t('materials')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-small-cell" v-for="mid in codexState.extra['upgrade_materials'][codexViewState.page.id]"
            border @click="() => global.enterCodex(category, mid)" :key="mid">
            <template #icon>
              <var-icon class="append-icon" :size="36"
                :name="global.getStaticUrl(codexState.used[category][mid]['icon'])" />
            </template>
            {{ codexState.lang[category][mid]['name'] }}
            <var-chip type="warning" size="mini" :round="true" plain>
              {{ global.getTier(codexState.used[category][mid]['tier']) }}
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
const category: string = 'items';
</script>