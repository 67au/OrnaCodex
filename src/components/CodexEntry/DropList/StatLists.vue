<script setup lang="ts">
import { global } from '@/plugins/global'
import type { PropType } from 'vue'
</script>

<template>
  <var-space size="mini" :class="{ 'line-height-none': size === 'mini' }">
    <template v-for="[key, value] in ss">
      <template v-if="typeof value === 'string'">
        <template v-if="key === 'costs'">
          <var-chip :size="size" :round="false" plain :key="key">
            {{ `${$t(`meta.stats.${key}`)}: ${value} ${$t('mana')}` }}
          </var-chip>
        </template>
        <template v-else-if="key === 'element'">
          <var-chip :size="size" :round="false" plain :color="global.elementColor[value]">
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
    stats: { type: Object, required: true },
    size: { type: String as PropType<'small' | 'mini'>, default: 'small' },
  },
  computed: {
    ss() {
      if (this.stats.element !== undefined) {
        return Object.entries(this.stats)
          .filter(([k, _]) => k !== 'element')
          .concat(this.stats.element.map((e: string) => ['element', e]))
      } else {
        return Object.entries(this.stats)
      }
    },
  }
})
</script>
