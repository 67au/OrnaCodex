<script setup lang="ts">
import { useFiltersState, useItemListState, useOptionsState } from '@/store';
import { watch, defineAsyncComponent, defineComponent } from 'vue';
import router from '@/router';
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
const filtersState = useFiltersState();
const optionsState = useOptionsState();
const itemListState = useItemListState();
const filtersStorage = useLocalStorage('filters', JSON.stringify(filtersState.$state));
const saveFilters = useDebounceFn(() => {
  filtersStorage.value = JSON.stringify(filtersState.$state);
}, 500, { maxWait: 1000 });

export default defineComponent({
  components: {
    HomeSearchCard: defineAsyncComponent(() => import("@/components/Home/HomeSearchCard.vue")),
    HomeListCard: defineAsyncComponent(() => import('@/components/Home/HomeListCard.vue')),
  },
  async beforeRouteUpdate(to, from) {
    if (to.query.search !== undefined) {
      try {
        filtersState.patch(filtersState.decode(to.query.search as string));
      } catch { }
      router.replace({ name: 'home' })
    }
  },
  created() {
    optionsState.init();
    if (this.$route.query.search !== undefined) {
      this.enterShare(this.$route.query.search as string);
    } else {
      filtersState.patch(JSON.parse(filtersStorage.value));
    }

    watch(filtersState.$state, () => {
      saveFilters();
      itemListState.render();
    }, { deep: true, immediate: true })

    this.loading = false;
    watch(() => this.$i18n.locale, () => {
      filtersState.search = '';
      itemListState.render();
    });
  },
  methods: {
    enterShare(share: string) {
      try {
        filtersState.patch(filtersState.decode(share));
      } catch { }
      router.replace({ name: 'home' })
    }
  },
  data() {
    return {
      loading: true,
    }
  }
})
</script>
