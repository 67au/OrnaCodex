<script setup lang="ts">
import { useCompareState } from '@/store';

import CompareResult from './CompareResult.vue';
</script>

<template>
  <var-fab type="primary" v-model:active="active" drag safe-area>
    <var-badge style="z-index: 500;" type="danger" offset-x="2" :value="compareList.length" :hidden="compareList.length === 0">
    <var-button type="warning" icon-container @click.stop="showCompare" :disabled="compareList.length === 0">
      <var-icon class="mdi mdi-scale-balance" />
    </var-button>
    </var-badge>
    <var-button type="primary" icon-container @click.stop="backTop">
      <var-icon name="chevron-up" />
    </var-button>
  </var-fab>
  <CompareResult v-model:show="show.compare" :items="compareList"/>
</template>

<script lang="ts">
export default {
  data() {
    return {
      active: false,
      show: {
        compare: false,
      }
    }
  },
  mounted() {
    const compareState = useCompareState();
    watch(() => compareState.list.length, (newValue) => {
      if (newValue > 0) {
        this.active = true
      }
    })
  },
  computed: {
    compareList() {
      const compareState = useCompareState();
      return compareState.list
    }
  },
  methods: {
    showCompare() {
      this.show.compare = true;
      this.active = false;
    },
    backTop() {
      const t = document.getElementById('main');
      t?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.active = false;
    }
  }
}
</script>