<script setup>
import { store, global } from '@/store';
</script>

<template>
  <template v-if="store.codex.usedItem['stats'] !== undefined">
    <var-card class="card" :title="$t('stats')">
      <template #description>
        <div class="card-description">
          <var-space class="space">
            <template v-for="stat, index in store.codex.usedItem['stats']">
              <template v-if="stat.length > 1">
                <var-chip size="small" :round="false" plain>
                  {{ `${stat.join(': ')}` }}
                </var-chip>
              </template>
              <template v-else-if="global.elementColor[store.codex.basedItem['stats'][index]] !== undefined">
                <var-chip size="small" :round="false" plain :color="global.elementColor[store.codex.basedItem['stats'][index]]">
                  {{ `${stat.join(': ')}` }}
                </var-chip>
              </template>
              <template v-else>
                <var-chip size="small" :round="false" plain>
                  {{ `${stat.join(': ')}` }}
                </var-chip>
              </template>
            </template>
          </var-space>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script>
export default {
}
</script>