<script setup lang="ts">
import { store, global } from '@/store'
</script>

<template>
  <template v-if="store.codexPage.category === 'spells' && store.codex.isOffhandSkill()">
    <var-card class="card" :title="$t('offhands')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-small-cell" v-for="aid in store.codex.extra['offhand_skills'][store.codexPage.id]" border
            @click="() => store.enterCodex(category, aid)" :key="aid">
            <template #icon>
              <var-icon class="append-icon" :size="36"
                :name="`${global.staticUrl}${store.codex.used[category][aid]['icon']}`" />
            </template>
            {{ store.codex.based[category][aid]['name'] }}
            <var-chip type="warning" size="mini" :round="true" plain>{{ global.star +
              store.codex.used[category][aid]['tier']
            }}</var-chip>
          </var-cell>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const category = 'items';
</script>