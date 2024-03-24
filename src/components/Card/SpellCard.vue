<script setup lang="ts">
import { global, useCodexState } from '@/store';
</script>

<template>
  <template v-if="codexState.page.category === 'spells' && codexState.isSkill()">
    <var-card class="card" :title="$t('speller')">
      <template #description>
        <div class="card-description">
          <template v-for="[category, spellers] in Object.entries(codexState.extra['skills'][codexState.page.id])">
            <var-cell class="codex-cell" border v-for="sid in spellers" @click="() => global.enterCodex(category, sid)" :key="sid">
              <template #icon>
                <var-icon class="append-icon" :size="36"
                  :name="global.getStaticUrl(codexState.used[category][sid]['icon'])" />
              </template>
              {{ codexState.based[category][sid]['name'] }}
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
</script>