<script setup lang="ts">
import { store, global } from '@/store';
import { defineComponent } from 'vue';
</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-form>
          <var-input variant="outlined" size="small" :placeholder="$t('search')" v-model="store.search" clearable
            @change="store.renderList" @clear="store.renderList" @input="store.renderList"
            style="padding-bottom: 4px;" />
          <var-cell class="filter-cell">
            <var-select variant="outlined" size="small" :placeholder="$t('sort')" v-model="store.sort" clearable
              @close="store.renderList" @change="store.renderList" @clear="store.renderList">
              <var-option value="name" :label="$t('name')" key="name" />
              <var-option value="tier" :label="$t('tier')" key="tier" />
              <var-option v-for="key in global.sortKeys" :value="key" :label="$t(`meta.stats.${key}`)" :key="key" />
            </var-select>
            <template #extra>
              <var-button type="primary" @click="() => { store.order = !store.order; store.renderList() }">
                {{ store.order ? $t('asc') : $t('desc') }}
              </var-button>
            </template>
          </var-cell>

          <template v-if="store.filters.length > 0">
            <var-divider> {{ $t('filters') }} </var-divider>
          </template>
          <var-cell v-for="filter in store.filters" class="filter-cell" :key="filter['k']">
            <var-select :placeholder="$t(filter['k'])" v-model="filter['v']" variant="outlined" size="small" clearable
              :multiple="Array.isArray(filter['v'])" :chip="Array.isArray(filter['v'])" @close="store.renderList"
              @change="store.renderList" @clear="store.renderList">

              <template v-if="filter['k'] != undefined">
                <template v-if="filter['k'] === 'category'">
                  <var-option :label="$t(`categories.${v}`)" :value="v" v-for="v in store.options[filter['k']]"
                    :key="v" />
                </template>

                <template v-else-if="filter['k'] === 'exotic'">
                  <var-option :label="v ? $t('yes') : $t('no')" :value="v" v-for="v in store.options[filter['k']]"
                    :key="v" />
                </template>

                <template v-else-if="filter['k'] === 'tier'">
                  <var-option :label="global.star + (v + 1)" :value="`${v + 1}`"
                    v-for="(_, v) in Array.from({ length: 10 })" :key="v" />
                </template>

                <template v-else-if="statusOptionsSet.has(filter['k'])">
                  <var-option :label="$t(`meta.status.${v}`)" :value="v" v-for="v in sortOptions(filter['k'])"
                    :key="v" />
                </template>

                <template v-else>
                  <var-option :label="$t(`meta.${filter['k']}.${v}`)" :value="v" v-for="v in sortOptions(filter['k'])"
                    :key="v" />
                </template>
              </template>

              <template #selected>
                <template v-if="filter['k'] === 'category'">
                  {{ $t(`categories.${filter['v']}`) }}
                </template>

                <template v-else-if="filter['k'] === 'exotic'">
                  {{ filter['v'] ? $t('yes') : $t('no') }}
                </template>
              </template>
            </var-select>
          </var-cell>
        </var-form>
      </div>
    </template>

    <template #extra>
      <var-button type="primary" text @click="resetFilters"> {{ $t('clear') }} </var-button>
      <var-menu placement="cover-bottom-end" close-on-click-reference v-model:show="show"
        v-if="store.options != undefined">
        <var-button type="primary" text> {{ $t('add') }} </var-button>
        <template #menu>
          <div style="overflow-y: scroll; max-height: 48vh;">
            <template v-for="[key, display], index in store.menus">
              <var-cell ripple @click="() => { addFilter(key); store.menus[index][1] = false; }" v-if="display"
                :key="key">
                {{ $t(key) }}
              </var-cell>
            </template>
          </div>
        </template>
      </var-menu>
    </template>
  </var-card>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: false,
    }
  },
  methods: {
    resetFilters() {
      store.filters = [];
      store.search = '';
      store.sort = undefined;
      store.menus = Object.keys(store.options).map((key: string) => [key, true]);
      store.renderList();
    },
    addFilter(key: string) {
      store.filters.push({ 'k': key, 'v': global.statusOptions.includes(key) ? [] : undefined, })
      this.show = false;
    },
    sortOptions(key: string) {
      const options = Array.from(store.options[key]) as Array<string>;
      if (this.statusOptionsSet.has(key)) {
        options.sort((a: string, b: string) => {
          return (this.$t(`meta.status.${a}`)).localeCompare(this.$t(`meta.status.${b}`));
        });
      } else {
        options.sort((a: string, b: string) => {
          return (this.$t(`meta.${key}.${a}`)).localeCompare(this.$t(`meta.${key}.${b}`));
        });
      }
      return options;
    }
  },
  computed: {
    statusOptionsSet() {
      return new Set(global.statusOptions);
    }
  }
})
</script>
