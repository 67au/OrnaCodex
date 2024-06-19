<script setup lang="ts">
import type { PropType } from 'vue'
</script>

<template>
  <var-popup :default-style="false" :show="show" @update:show="$emit('update:show', $event)">
    <var-paper
      radius="16px"
      width="90vw"
      class="p-3"
      :class="{
        'max-w-xs': maxWidth === 'xs',
        'max-w-sm': maxWidth === 'sm',
        'max-w-md': maxWidth === 'md',
        'max-w-lg': maxWidth === 'lg',
        'max-w-xl': maxWidth === 'xl'
      }"
    >
      <var-space align="center" justify="space-between" size="large" line>
        <slot name="title"></slot>
        <var-space align="center" justify="flex-end" size="mini" line>
          <slot name="button"></slot>
          <PopupButton
            type="danger"
            icon-class="i-mdi-window-close"
            @click="$emit('update:show', false)"
          />
        </var-space>
      </var-space>
      <slot name="default"></slot>
    </var-paper>
  </var-popup>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    maxWidth: {
      type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
      default: 'xs'
    }
  }
})
</script>
