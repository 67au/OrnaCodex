<script setup lang="ts">
import { global, useFiltersState, useItemListState, useOptionsState } from '@/store';
import { defineComponent } from 'vue';
import { useLocalStorage } from '@vueuse/core';
</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-form>
          <var-input variant="outlined" size="small" :placeholder="$t('search')" v-model="filtersState.search" clearable
            style="padding-bottom: 4px;" />
          <var-cell class="filter-cell">
            <var-select variant="outlined" size="small" :placeholder="$t('sort')" v-model="filtersState.sort" clearable>
              <var-option value="name" :label="$t('name')" key="name" />
              <var-option value="tier" :label="$t('tier')" key="tier" />
              <var-option v-for="key in filtersState.sortKeys" :value="key" :label="$t(`meta.stats.${key}`)" :key="key" />
            </var-select>
            <template #extra>
              <var-button type="primary" @click="filtersState.asc = !filtersState.asc">
                {{ filtersState.asc ? $t('asc') : $t('desc') }}
              </var-button>
            </template>
          </var-cell>

          <template v-if="filtersState.filters.length > 0">
            <var-divider> {{ $t('filters') }} </var-divider>
          </template>
          <var-cell v-for="filter in filtersState.filters" class="filter-cell" :key="filter.key">
            <var-select :placeholder="$t(filter.key)" v-model="filter.value" variant="outlined" size="small" clearable
              :multiple="Array.isArray(filter.value)" :chip="Array.isArray(filter.value)">

              <template v-if="filter.key != undefined">
                <template v-if="filter.key === 'category'">
                  <var-option :label="$t(`categories.${v}`)" :value="v" v-for="v in optionsState.options[filter.key]"
                    :key="v" />
                </template>

                <template v-else-if="filter.key === 'exotic'">
                  <var-option :label="v ? $t('yes') : $t('no')" :value="v" v-for="v in optionsState.options[filter.key]"
                    :key="v" />
                </template>

                <template v-else-if="filter.key === 'tier'">
                  <var-option :label="global.getTier(v + 1)" :value="`${v + 1}`"
                    v-for="(_, v) in Array.from({ length: 10 })" :key="v" />
                </template>

                <template v-else-if="isStatusKey(filter.key)">
                  <var-option :label="$t(`meta.status.${v}`)" :value="v" v-for="v in sortOptions(filter.key)"
                    :key="v" />
                </template>

                <template v-else>
                  <var-option :label="$t(`meta.${filter.key}.${v}`)" :value="v" v-for="v in sortOptions(filter.key)"
                    :key="v" />
                </template>
              </template>

              <template #selected>
                <template v-if="filter.key === 'category'">
                  {{ $t(`categories.${filter.value}`) }}
                </template>

                <template v-else-if="filter.key === 'exotic'">
                  {{ filter.value ? $t('yes') : $t('no') }}
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
        v-if="optionsState.options != undefined">
        <var-button type="primary" text> {{ $t('add') }} </var-button>
        <template #menu>
          <div style="overflow-y: scroll; max-height: 48vh;">
            <template v-for="[key, display], index in optionsState.menu">
              <var-cell ripple
                @click="() => { filtersState.add(key); show = false; optionsState.menu[index][1] = false; }"
                v-if="display" :key="key">
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
const filtersState = useFiltersState();
const optionsState = useOptionsState();
const itemListState = useItemListState();

export default defineComponent({
  mounted() {
    const filtersStorage = useLocalStorage('filters', JSON.stringify(filtersState.$state));
    const filtersJson = JSON.parse(filtersStorage.value);
    filtersState.patch(filtersJson);
    const saveFilters = useDebounceFn(() => {
      filtersStorage.value = JSON.stringify(filtersState.$state);
    }, 500, { maxWait: 1000 })
    watch(filtersState.$state, (newValue, oldValue) => {
      saveFilters();
      itemListState.render();
    }, { deep: true })
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    resetFilters() {
      filtersState.reset();
      itemListState.render();
    },
    isStatusKey(key: string) {
      return optionsState.keys.status.includes(key);
    },
    sortOptions(key: string) {
      const options = Array.from(optionsState.options[key]) as Array<string>;
      if (this.isStatusKey(key)) {
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
})
</script>
