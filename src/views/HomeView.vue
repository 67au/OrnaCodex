<script setup lang="ts">
import { watch, defineAsyncComponent, defineComponent } from 'vue';
import { store } from '@/store';
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

export default defineComponent({
  components: {
    HomeSearchCard: defineAsyncComponent(() => import("@/components/Card/HomeSearchCard.vue")),
    HomeListCard: defineAsyncComponent(() => import('@/components/Card/HomeListCard.vue')),
  },
  mounted() {
    store.buildOptions();
    store.renderList();
    this.loading = false;
    watch(() => this.$i18n.locale, () => {
      store.buildOptions();
      store.renderList();
    });
  },
  data() {
    return {
      store,
      loading: false,
    }
  }
})
</script>
