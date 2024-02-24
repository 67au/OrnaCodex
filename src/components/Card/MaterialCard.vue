<script setup>
import { store, global } from '@/store'
</script>

<template>
  <template v-if="store.codexPage.category === 'items' && store.codex.isMaterial()">
    <var-card class="card" :title="$t('materials')">
      <template #description>
        <div class="card-description">
          <var-cell class="codex-small-cell" v-for="mid in store.codex.meta['upgrade_materials'][store.codexPage.id]" border
            @click="() => store.enterCodex(category, mid)">
            <template #icon>
              <var-icon class="append-icon" :size="36"
                :name="`${global.staticUrl}${store.codex.used[category][mid]['icon']}`" />
            </template>
            {{ store.codex.used[category][mid]['name'] }}
            <var-chip type="warning" size="mini" :round="true" plain>{{ global.star +
              store.codex.used[category][mid]['tier']
            }}</var-chip>
          </var-cell>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script>
const category = 'items';

export default {
}
</script>