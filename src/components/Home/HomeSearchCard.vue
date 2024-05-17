<script setup lang="ts">
import { global, useFiltersState, useOptionsState } from '@/store';
import { defineComponent } from 'vue';
import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
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
            <var-select
              :placeholder="`${$t(filter.key)}${Array.isArray(filter.value) && filter.key !== 'exotic' && !isStatusKey(filter.key) ? ` (${$t('multiple')})` : ''}`"
              v-model="filter.value" variant="outlined" size="small" clearable
              :multiple="Array.isArray(filter.value) && filter.key !== 'exotic'" :chip="Array.isArray(filter.value)">

              <template v-if="filter.key !== undefined">
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
                  <var-option :label="$t(`meta.status.${v}`)" :value="v" v-for="v in sortOptions(filter.key)" :key="v" />
                </template>

                <template v-else>
                  <var-option :label="$t(`meta.${filter.key}.${v}`)" :value="v" v-for="v in sortOptions(filter.key)"
                    :key="v" />
                </template>
              </template>

              <template #selected>
                <template v-if="filter.key === 'exotic'">
                  {{ filter.value ? $t('yes') : $t('no') }}
                </template>
              </template>
            </var-select>
          </var-cell>
        </var-form>
      </div>
    </template>

    <template #extra>
      <var-space justify="space-between" align="baseline" style="width: 100%;">
        <var-checkbox v-model="multi" icon-size="18" style="margin-left: 10px;">
          <template #default>
            <div :style="{
              'font-size': '15px',
              'color': multiple?'var(--color-primary)':'var(--color-default)',
              'margin-left': '-2px',
            }">
              {{ $t('multiple') }}
            </div>
          </template>
        </var-checkbox>
        <var-space justify="flex-end" size="mini">
          <var-button type="primary" text @click="resetFilters">
            <var-icon name="alert-outline" size="16" style="margin-right: 2px;"/>
            {{ $t('clear') }}
          </var-button>
          <var-menu placement="cover-bottom-end" close-on-click-reference v-model:show="show.menu"
            v-if="optionsState.options != undefined">
            <var-button type="primary" text>
              <var-icon name="check" size="16" style="margin-right: 2px;"/>
              {{ $t('add') }}
            </var-button>
            <template #menu>
              <div style="overflow-y: scroll; max-height: 48vh;">
                <template v-for="[key, display], index in optionsState.menu">
                  <var-cell ripple
                    @click="() => { filtersState.add(key); show.menu = false; optionsState.menu[index][1] = false; }"
                    v-if="display" :key="key">
                    {{ $t(key) }}
                  </var-cell>
                </template>
              </div>
            </template>
          </var-menu>
        </var-space>
      </var-space>
    </template>
  </var-card>
</template>

<script lang="ts">
const filtersState = useFiltersState();
const optionsState = useOptionsState();
const { multi } = storeToRefs(filtersState);
const source = ref('');

export default defineComponent({
  data() {
    return {
      show: {
        menu: false,
        share: false,
      },
    }
  },
  computed: {
    multiple: {
      set(newValue: boolean) {
        multi.value = newValue
      },
      get() {
        return multi.value;
      }
    }
  },
  methods: {
    share() {
      source.value = `${location.href.split('#')[0]}#/?search=${filtersState.encode()}`
      this.show.share = true;
    },
    resetFilters() {
      filtersState.init();
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
