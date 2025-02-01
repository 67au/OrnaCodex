<script setup lang="ts">
import { useCompareState } from '@/stores/compare'
</script>

<template>
  <var-badge
    class="z-200"
    type="danger"
    :offset-x="-5"
    :offset-y="5"
    :value="compareState.length"
    :hidden="isEmpty"
  >
    <var-button @click="show=true" icon-container text round :disabled="isEmpty">
      <div class="i-mdi-scale-balance text-xl" />
    </var-button>
  </var-badge>
  <CompareTool v-model:show="show" />
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: false
    }
  },
  computed: {
    compareState() {
      return useCompareState()
    },
    isEmpty() {
      return this.compareState.length === 0
    }
  }
})
</script>
