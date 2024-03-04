<script setup lang="ts">
import { store, global } from '@/store';
</script>

<template>
  <template v-if="store.codex.usedItem['stats'] !== undefined">
    <var-card class="card" :title="$t('stats')">
      <template #description>
        <div class="card-description">
          <var-space class="space">
            <template v-if="store.codexPage.category == 'items'">
              <template v-for="[stat_key, value] in (Object.entries(store.codex.usedItem['stats']) as Array<[string, string]>)">
                <template v-if="!singleSet.has(stat_key)">
                  <var-chip size="small" :round="false" plain :key="stat_key">
                    {{ `${$t('stat_key.' + stat_key)}: ${value}` }}
                  </var-chip>
                </template>

                <template v-else-if="stat_key === 'element'">
                  <var-chip size="small" :round="false" plain :color="global.elementColor[value]" :key="stat_key">
                    {{ `${$t('stat_key.' + value)}` }}
                  </var-chip>
                </template>

                <template v-else>
                  <var-chip size="small" :round="false" plain :key="stat_key">
                    {{ `${$t('stat_key.' + stat_key)}` }}
                  </var-chip>
                </template>
              </template>
            </template>

            <template v-else>
              <var-chip size="small" :round="false" plain v-for="stat, index in store.codex.usedItem['stats']" :key="index">
                {{ `${stat.join(': ')}` }}
              </var-chip>
            </template>
          </var-space>
        </div>
      </template>
    </var-card>
  </template>
</template>

<script lang="ts">
const singleSet = new Set(['two_handed', 'element']);
</script>