<script setup lang="ts">
import { global } from '@/plugins/global'
import type { PropType } from 'vue'
</script>

<template>
  <var-space size="small" :class="{ 'line-height-none': size === 'mini' }">
    <template v-for="[key, value] in Object.entries(stats)">
      <template v-if="typeof value === 'string'">
        <template v-if="key === 'element'">
          <var-chip
            :size="size"
            :round="false"
            plain
            :color="global.elementColor[value]"
            :key="key"
          >
            {{ $t(`meta.stats.${value}`) }}
          </var-chip>
        </template>
        <template v-else>
          <var-chip :size="size" :round="false" plain :key="key">
            {{ `${$t(`meta.stats.${key}`)}: ${value}` }}
          </var-chip>
        </template>
      </template>
      <template v-else>
        <var-chip type="primary" :size="size" :round="false" :key="key">
          {{ $t(`meta.stats.${key}`) }}
        </var-chip>
      </template>
    </template>
  </var-space>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    stats: {
      type: Object,
      required: true
    },
    size: {
      type: Object as PropType<'small' | 'mini'>,
      default: 'small'
    }
  }
})
</script>
