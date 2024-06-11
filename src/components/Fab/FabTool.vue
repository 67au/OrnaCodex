<script setup lang="ts">
import { useCompareState } from '@/stores/compare';

</script>

<template>
  <var-fab type="primary" v-model:active="active" drag safe-area>
    <var-badge class="z-200" type="danger" offset-x="2" :value="compareState.length"
      :hidden="compareState.length === 0">
      <var-button type="warning" icon-container @click.stop="showCompare" :disabled="compareState.length === 0">
        <div class="i-mdi-scale-balance text-xl" />
      </var-button>
    </var-badge>
    <var-button type="primary" icon-container @click.stop="backToTop">
      <div class="i-mdi-chevron-up text-xl" />
    </var-button>
  </var-fab>
  <CompareTool v-model:show="show.compare" />
</template>

<script lang="ts">
export default defineComponent({
  mounted() {
    watch(() => this.compareState.length, (newValue) => {
      if (newValue > 0) {
        this.active = true
      }
    })
  },
  data() {
    return {
      active: false,
      show: {
        compare: false
      }
    }
  },
  methods: {
    backToTop() {
      window.scroll({ top: 0, behavior: 'smooth' })
      this.active = false
    },
    showCompare() {
      this.active = false
      setTimeout(() => {
        this.show.compare = true
      }, 100)
    },
  },
  computed: {
    compareState() {
      return useCompareState()
    },
  }
})
</script>