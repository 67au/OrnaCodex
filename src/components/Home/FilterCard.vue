<script setup lang="ts">
import { useFiltersState, useOptionsState } from '@/stores';
import { getTierName } from '@/plugins/utils';

</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-form>
          <var-input variant="outlined" size="small" :placeholder="$t('search')" v-model="filtersState.search" clearable
            class="pb-1" />
          <var-cell class="filter-cell">
            <var-select variant="outlined" size="small" :placeholder="$t('sort')" v-model="filtersState.sort" clearable>
              <var-option value="name" :label="$t('name')" key="name" />
              <var-option value="tier" :label="$t('tier')" key="tier" />
              <var-option v-for="key in filtersState.statsKeys" :value="key" :label="$t(`meta.stats.${key}`)"
                :key="key" />
            </var-select>
            <template #extra>
              <var-button type="primary" @click="filtersState.asc = !filtersState.asc">
                {{ filtersState.asc ? $t('asc') : $t('desc') }}
              </var-button>
            </template>
          </var-cell>

          <var-cell class="filter-cell min-h-8">
            <template #icon>
              <div class="i-mdi-filter text-lg mr-1"></div>
            </template>
            <div class="text-lg">
              {{ $t('filters') }}
            </div>
            <template #extra>
              <var-checkbox v-model="filtersState.multiple" icon-size="18" class="-mr-1">
                <template #default>
                  <div :style="{
                    'color': filtersState.multiple ? 'var(--color-primary)' : 'var(--color-default)',
                  }" class="whitespace-nowrap">
                    {{ $t('multiple') }}
                  </div>
                </template>
              </var-checkbox>
            </template>
          </var-cell>

          <var-cell class="filter-cell" v-for="filter in filtersState.filters" :key="filter.key">
            <var-select :placeholder="`${$t(filter.key)}${getMultipleTag(filter.key)}`" v-model="filter.value"
              variant="outlined" size="small" clearable
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
                  <var-option :label="getTierName(v + 1)" :value="`${v + 1}`"
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
      <var-space justify="flex-end" class="z-0">
        <var-button type="primary" @click="filtersState.reset">
          {{ $t('clear') }}
        </var-button>
        <var-menu placement="cover-bottom-end" close-on-click-reference v-model:show="show.menu"
          v-if="optionsState.options != undefined">
          <var-button type="primary">
            {{ $t('add') }}
          </var-button>
          <template #menu>
            <div class="overflow-y-auto max-h-50vh">
              <template v-for="[key, display], index in optionsState.menu">
                <var-cell ripple @click="() => { filtersState.addFilter(index); show.menu = false; }" v-if="display"
                  :key="key">
                  {{ `${$t(key)} ${getMultipleTag(key)}` }}
                </var-cell>
              </template>
            </div>
          </template>
        </var-menu>
      </var-space>
    </template>
  </var-card>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: {
        menu: false
      }
    }
  },
  computed: {
    filtersState() {
      return useFiltersState()
    },
    optionsState() {
      return useOptionsState()
    }
  },
  methods: {
    isStatusKey(key: string) {
      return this.optionsState.keys.status.includes(key)
    },
    getMultipleTag(key: string) {
      return this.filtersState.isMultiple(key) ? ` (${this.$t('multiple')})` : ''
    },
    sortOptions(key: string) {
      const options = Array.from(this.optionsState.options[key]) as Array<string>
      if (this.isStatusKey(key)) {
        options.sort((a: string, b: string) => {
          return (this.$t(`meta.status.${a}`)).localeCompare(this.$t(`meta.status.${b}`))
        });
      } else {
        options.sort((a: string, b: string) => {
          return (this.$t(`meta.${key}.${a}`)).localeCompare(this.$t(`meta.${key}.${b}`))
        });
      }
      return options
    }
  }
})
</script>

<style scoped lang="less">
.filter-cell {
  padding: 3px 0px;
}
</style>