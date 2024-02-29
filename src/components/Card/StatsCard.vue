<script setup>
import { store, global } from '@/store';
</script>

<template>
  <template v-if="store.codex.usedItem['stats'] !== undefined">
    <var-card class="card" :title="$t('stats')">
      <template #description>
        <div class="card-description">
          <var-space class="space">
            <template v-if="store.codexPage.category == 'items'">
              <template v-for="[stat_key, value] in Object.entries(store.codex.usedItem['stats'])">
                <template v-if="!singleSet.has(stat_key)">
                  <var-chip size="small" :round="false" plain>
                    {{ `${$t('stat_key.' + stat_key)}: ${value}` }}
                  </var-chip>
                </template>
                <template v-else-if="stat_key === 'element'">
                  <var-chip size="small" :round="false" plain :color="global.elementColor[value]">
                    {{ `${$t('stat_key.' + value)}` }}
                  </var-chip>
                </template>
                <template v-else>
                  <var-chip size="small" :round="false" plain>
                    {{ `${$t('stat_key.' + stat_key)}` }}
                  </var-chip>
                </template>
              </template>
            </template>
            <template v-else>
              <template v-for="stat in store.codex.usedItem['stats']">
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
const singleSet = new Set(['two_handed', 'element']);

export default {
}
</script>