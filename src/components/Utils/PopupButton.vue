<script setup lang="ts">
import type { PropType } from 'vue'
import type { ButtonType } from '@varlet/ui'
</script>

<template>
  <var-button :type="type" size="small" round icon-container @click="$emit('click')" elevation="3">
    <div class="text-lg" :class="iconClass"></div>
  </var-button>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'default'
    },
    iconClass: {
      type: String,
      default: ''
    }
  }
})
</script>
