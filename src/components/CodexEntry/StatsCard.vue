<script setup lang="ts">
import type { CodexEntry } from '@/plugins/codex';
import { global } from '@/plugins/global';
</script>

<template>
  <var-card v-if="ce.meta.stats !== undefined" class="card" :title="$t('stats')">
    <template #description>
      <div class="card-description">
        <var-space>
          <template v-for="[key, value] in (Object.entries(ce.meta.stats))">
            <template v-if="typeof value === 'string'">
              <template v-if="key === 'element'">
                <var-chip size="small" :round="false" plain :color="global.elementColor[value]" :key="key">
                  {{ $t(`meta.stats.${value}`) }}
                </var-chip>
              </template>
              <template v-else>
                <var-chip size="small" :round="false" plain :key="key">
                  {{ `${$t(`meta.stats.${key}`)}: ${value}` }}
                </var-chip>
              </template>
            </template>
            <template v-else>
              <var-chip type="primary" size="small" :round="false" :key="key">
                {{ $t(`meta.stats.${key}`) }}
              </var-chip>
            </template>
          </template>
        </var-space>
      </div>
    </template>
  </var-card>
</template>

<script lang="ts">
export default defineComponent({
  inject: ['view'],
  computed: {
    ce() {
      return this.view as CodexEntry
    }
  }
})
</script>
