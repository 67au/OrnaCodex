<script setup lang="ts">
import { useFiltersState, useItemListState, useOptionsState } from '@/store';
import { watch, defineAsyncComponent, defineComponent } from 'vue';
</script>


<template>
  <main>
    <div class="container" v-if="!loading">
      <component :is="'HomeSearchCard'"></component>
      <component :is="'HomeListCard'"></component>
    </div>
  </main>
</template>

<script lang="ts">
const filtersState= useFiltersState();
const optionsState= useOptionsState();
const itemListState= useItemListState();

export default defineComponent({
  components: {
    HomeSearchCard: defineAsyncComponent(() => import("@/components/Card/HomeSearchCard.vue")),
    HomeListCard: defineAsyncComponent(() => import('@/components/Card/HomeListCard.vue')),
  },
  mounted() {
    optionsState.init();
    itemListState.render();
    this.loading = false;
    watch(() => this.$i18n.locale, () => {
      filtersState.search = '';
      itemListState.render();
    });
  },
  data() {
    return {
      loading: true,
    }
  }
})
</script>
