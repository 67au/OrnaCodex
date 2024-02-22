<script setup>
import { watch } from 'vue';
import { store } from '@/store';
import { defineAsyncComponent } from 'vue';
</script>

<template>
  <main>
    <div class="container" v-if="!loading">
      <component is="HomeSearchCard"></component>
      <component is="HomeListCard"></component>
    </div>
  </main>
</template>

<script>

export default {
  components: {
    HomeSearchCard: defineAsyncComponent(() => import("@/components/Card/HomeSearchCard.vue")),
    HomeListCard: defineAsyncComponent(() => import('@/components/Card/HomeListCard.vue')),
  },
  mounted() {
    store.buildOptions();
    store.renderList();
    this.loading = false;
    watch(() => store.lang, (newVal, oldVal) => {
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
}
</script>

<style scoped></style>
