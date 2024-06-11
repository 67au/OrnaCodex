<script setup lang="ts">
import { CodexEntry } from '@/plugins/codex';
import router from '@/router';
import { useCompareState } from '@/stores/compare';
import { useHistoryState } from '@/stores/history';

</script>

<template>
  <var-fab type="primary" v-model:active="active" drag safe-area>
    <var-badge class="z-200" type="danger" offset-x="2" :value="compareState.length"
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

    const historyStorage = useLocalStorage('history', JSON.stringify(this.historyState.list))
    this.historyState.initialize(JSON.parse(historyStorage.value))

    router.afterEach((to, from) => {
      if (to.name === 'codex') {
        const entry = new CodexEntry(to.params.category as string, to.params.id as string)
        if (entry.meta !== undefined) {
          this.historyState.add(entry)
          historyStorage.value = JSON.stringify(this.historyState.list)
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
      setTimeout(() => {
        this.show.compare = true
      }, 100)
    },
    showHistory() {
      this.active = false
      setTimeout(() => {
        this.show.history = true
      }, 100)
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