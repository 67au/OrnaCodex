<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import router from '@/router';
import { useCompareState, useHistoryState } from '@/stores';

</script>

<template>
  <var-fab type="primary" v-model:active="active" drag safe-area>
    <var-badge style="z-index: 200;" type="danger" offset-x="2" :value="compareState.length"
      :hidden="compareState.length === 0">
      <var-button type="warning" icon-container @click.stop="showCompare" :disabled="compareState.length === 0">
        <div class="i-mdi-scale-balance text-xl" />
      </var-button>
    </var-badge>
    <var-button type="info" icon-container @click.stop="showHistory">
      <div class="i-mdi-history text-xl" />
    </var-button>
    <var-button type="primary" icon-container @click.stop="backToTop">
      <div class="i-mdi-chevron-up text-xl" />
    </var-button>
  </var-fab>
  <CompareTool v-model:show="show.compare" />
  <HistoryTool v-model:show="show.history" />
</template>

<script lang="ts">
export default defineComponent({
  mounted() {
    watch(() => this.compareState.length, (newValue) => {
      if (newValue > 0) {
        this.active = true
      }
    })

    router.afterEach((to, from) => {
      if (to.name === 'codex') {
        const entry = new CodexEntry(to.params.category as string, to.params.id as string)
        if (entry.meta !== undefined) {
          this.historyState.add(entry)
        }
      }
    })
  },
  data() {
    return {
      active: false,
      show: {
        compare: false,
        history: false
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
      this.show.compare = true
    },
    showHistory() {
      this.active = false
      setTimeout(() => {
        this.show.history = true
      }, 150)
    }
  },
  computed: {
    compareState() {
      return useCompareState()
    },
    historyState() {
      return useHistoryState()
    }
  }
})
</script>