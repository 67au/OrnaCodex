<script setup lang="ts">
import { global, useCodexState } from '@/store'
</script>

<template>
  <template v-if="codexState.page.category === 'items' && codexState.isMaterial()">
    <var-card class="card" :title="$t('materials')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-small-cell" v-for="mid in codexState.extra['upgrade_materials'][codexState.page.id]"
            border @click="() => global.enterCodex(category, mid)" :key="mid">
            <template #icon>
              <var-icon class="append-icon" :size="36"
                :name="global.getStaticUrl(codexState.used[category][mid]['icon'])" />
            </template>
            {{ codexState.based[category][mid]['name'] }}
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
const category: string = 'items';
</script>