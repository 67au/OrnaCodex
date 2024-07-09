<script setup lang="ts">
import { useFiltersState } from '@/stores/filters'
import { useOptionsState } from '@/stores/options'
import { getTierName } from '@/plugins/utils'
import { useSortState } from '@/stores/sort'
</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-form>
          <var-cell class="filter-cell min-h-8">
            <var-space justify="space-between" align="center" class="pb-1">
              <var-space justify="flex-start" align="center" size="small">
                <Icon class="text-lg" icon-class="i-mdi-sort" />
                <div class="text-lg">{{ $t('sort') }}</div>
              </var-space>
              <var-space justify="flex-end" align="center" size="small">
                <var-chip
                  size="small"
                  class="text-md"
                  type="primary"
                  elevation="2"
                  @click="() => (show.sortDefault = !show.sortDefault)"
                >
                  <var-space align="center" size="0" line>
                    <template v-if="sortState.default.name === 'default'">
                      {{ $t('sortDefault') }}
                    </template>
                    <template v-else>
                      {{ $t(sortState.default.name) }}
                    </template>
                    <template v-if="sortState.default.name !== 'default'">
                      <Icon
                        class="text-lg"
                        v-if="sortState.default.asc"
                        icon-class="i-mdi-arrow-upward"
                      />
                      <Icon class="text-lg" v-else icon-class="i-mdi-arrow-downward" />
                    </template>
                  </var-space>
                </var-chip>
              </var-space>
            </var-space>
          </var-cell>

          <var-cell class="filter-cell min-h-8">
            <var-space justify="space-between" align="center">
              <var-space justify="flex-start" align="center" size="small">
                <var-chip
                  class="text-md"
                  size="small"
                  :type="sortState.name === undefined ? 'default' : 'success'"
                  elevation="2"
                  @click="() => (show.sort = !show.sort)"
                >
                  <template #left>
                    <div
                      v-if="sortState.name === undefined"
                      class="text-lg i-mdi-view-dashboard-edit"
                    ></div>
                  </template>
                  <div v-if="sortState.name === undefined">{{ defaultLabel }}</div>
                  <div v-else>{{ $t(`meta.stats.${sortState.name}`) }}</div>
                </var-chip>
              </var-space>
              <var-space justify="flex-end" align="center" size="small">
                <var-tooltip placement="top" :content="$t(sortState.asc ? 'asc' : 'desc')">
                  <PopupButton
                    type="warning"
                    :icon-class="sortState.asc ? 'i-mdi-sort-ascending' : 'i-mdi-sort-descending'"
                    @click="() => (sortState.asc = !sortState.asc)"
                  />
                </var-tooltip>
                <var-tooltip placement="top" :content="$t('clear')">
                  <PopupButton
                    type="danger"
                    icon-class="i-mdi-trash"
                    @click="
                      () => {
                        sortState.reset()
                        sort.search = ''
                      }
                    "
                  />
                </var-tooltip>
              </var-space>
            </var-space>
          </var-cell>

          <var-divider dashed />

          <var-cell class="filter-cell min-h-8">
            <var-space justify="space-between" align="center" class="pb-1">
              <var-space justify="flex-start" align="center" size="small">
                <Icon class="text-lg" icon-class="i-mdi-filter" />
                <div class="text-lg">{{ $t('filters') }}</div>
              </var-space>
              <var-space justify="flex-end" align="center" size="small">
                <var-tooltip placement="top" :content="$t('multiple')">
                  <PopupButton
                    :type="filtersState.multiple ? 'success' : 'default'"
                    :icon-class="filtersState.multiple ? 'i-mdi-tag-multiple' : 'i-mdi-tag'"
                    @click="() => (filtersState.multiple = !filtersState.multiple)"
                  />
                </var-tooltip>
                <var-tooltip placement="top" :content="$t('clear')">
                  <PopupButton type="danger" icon-class="i-mdi-trash" @click="filtersState.reset" />
                </var-tooltip>
                <var-tooltip placement="top" :content="$t('add')">
                  <PopupButton
                    type="primary"
                    icon-class="i-mdi-add"
                    @click="show.menu = !show.menu"
                  />
                </var-tooltip>
              </var-space>
            </var-space>
          </var-cell>

          <var-cell class="filter-cell">
            <var-input
              class="w-full"
              variant="outlined"
              size="small"
              :placeholder="$t('search')"
              v-model="filtersState.search"
              clearable
            />
          </var-cell>

          <var-cell class="filter-cell" v-for="[key, filter] in filtersState.filters" :key="key">
            <var-select
              :placeholder="`${$t(key)}${getMultipleTag(key)}`"
              v-model="filter.value"
              variant="outlined"
              size="small"
              clearable
              :multiple="Array.isArray(filter.value) && key !== 'exotic'"
              :chip="Array.isArray(filter.value)"
              :options="optionsMap[key]"
            >
            </var-select>
          </var-cell>
        </var-form>
      </div>
    </template>
  </var-card>

  <PopupPaper v-model:show="show.menu" max-width="md">
    <template #title>
      <var-chip class="text-md" type="primary" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-filter text-lg" />
        </template>
        <div>{{ $t('filters') }}</div>
      </var-chip>
    </template>
    <var-divider dashed />
    <var-paper radius="0px">
      <var-space size="small" class="chip-list px-1 py-1">
        <var-chip
          :type="filtersState.filters.has(key) ? 'success' : 'default'"
          v-for="key in Object.keys(optionsMap)"
          elevation="3"
          @click="() => editFilters(key)"
        >
          {{ `${$t(key)} ${getMultipleTag(key)}` }}
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>

  <PopupPaper v-model:show="show.sort" max-width="md">
    <template #title>
      <var-chip class="text-md" type="primary" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-sort text-lg" />
        </template>
        <div>{{ $t('sort') }}</div>
      </var-chip>
    </template>
    <template #button>
      <PopupButton
        type="info"
        icon-class="i-mdi-magnify"
        @click="() => (show.expand = !show.expand)"
      />
    </template>
    <var-collapse-transition :expand="show.expand">
      <var-input
        class="w-full pt-3"
        variant="outlined"
        size="small"
        :placeholder="$t('search')"
        v-model="sort.search"
        clearable
      />
    </var-collapse-transition>

    <var-divider dashed />

    <var-paper radius="0px">
      <var-space size="small" class="chip-list px-1 py-1">
        <var-chip
          :type="sortState.name === key ? 'success' : 'default'"
          v-for="key in sortKeys"
          elevation="3"
          @click="() => editSort(key)"
        >
          {{ $t(`meta.stats.${key}`) }}
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>

  <PopupPaper v-model:show="show.sortDefault" max-width="md">
    <template #title>
      <var-chip class="text-md" type="primary" elevation="3">
        <template #left>
          <Icon icon-class="i-mdi-sort text-lg" />
        </template>
        <div>{{ $t('sortDefault') }}</div>
      </var-chip>
    </template>

    <var-divider dashed />

    <var-paper radius="0px">
      <var-space size="small" class="chip-list px-1 py-1">
        <var-chip
          :type="sortState.default.name === 'default' ? 'success' : 'default'"
          elevation="3"
          @click="() => editSortDefault()"
        >
          {{ $t('query.qualitylabel.default') }}
        </var-chip>
        <var-chip
          v-for="[name, asc] in [
            ['name', true],
            ['name', false],
            ['tier', true],
            ['tier', false]
          ]"
          :type="
            sortState.default.name === name && sortState.default.asc === asc ? 'success' : 'default'
          "
          elevation="3"
          @click="() => editSortDefault(name as string, asc as boolean)"
        >
          <var-space align="center" size="0" line>
            {{ $t(name as string) }}
            <Icon v-if="asc as boolean" class="text-lg" icon-class="i-mdi-arrow-upward" />
            <Icon v-else class="text-lg" icon-class="i-mdi-arrow-downward" />
          </var-space>
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: {
        menu: false,
        sort: false,
        sortDefault: false,
        expand: false
      },
      sort: {
        search: ''
      }
    }
  },
  computed: {
    filtersState() {
      return useFiltersState()
    },
    optionsState() {
      return useOptionsState()
    },
    sortState() {
      return useSortState()
    },
    defaultLabel() {
      return this.$t('query.qualitylabel.default')
    },
    sortKeys() {
      const regex = new RegExp(this.sort.search)
      return this.sortState.statsKeys.filter((key) => {
        return regex.test(this.$t(`meta.stats.${key}`))
      })
    },
    optionsMap() {
      return Object.fromEntries(
        Object.entries(this.optionsState.options).map(([key, value]) => {
          if (key === 'category') {
            return [
              key,
              Array.from(value as Set<string>).map((v: string) => {
                return { label: this.$t(`categories.${v}`), value: v }
              })
            ]
          }
          if (key === 'exotic') {
            return [
              key,
              Array.from(value as Set<boolean>).map((v: boolean) => {
                return { label: v ? this.$t('yes') : this.$t('no'), value: v }
              })
            ]
          }
          if (key === 'tier') {
            return [
              key,
              Array.from({ length: 10 }).map((_, v: number) => {
                return { label: getTierName(v + 1), value: String(v + 1) }
              })
            ]
          }
          const k = this.isStatusKey(key) ? 'status' : key
          return [
            key,
            Array.from(value as Set<string>)
              .sort((a: string, b: string) => {
                return this.$t(`meta.${k}.${a}`).localeCompare(this.$t(`meta.${k}.${b}`))
              })
              .map((v: string) => {
                return { label: this.$t(`meta.${k}.${v}`), value: v }
              })
          ]
        })
      )
    }
  },
  methods: {
    isStatusKey(key: string) {
      return this.optionsState.keys.status.includes(key)
    },
    getMultipleTag(key: string) {
      return this.filtersState.isMultiple(key) ? ` (${this.$t('multiple')})` : ''
    },
    editSort(key: string) {
      this.show.sort = false
      setTimeout(() => {
        this.sortState.name = key
      }, 50)
    },
    editSortDefault(key: string = 'default', asc: boolean = false) {
      this.show.sortDefault = false
      setTimeout(() => {
        this.sortState.default.name = key
        this.sortState.default.asc = asc
      }, 50)
    },
    editFilters(key: string) {
      if (this.filtersState.filters.has(key)) {
        this.filtersState.removeFilter(key)
      } else {
        this.filtersState.addFilter(key)
      }
    }
  }
})
</script>

<style scoped lang="less">
.filter-cell {
  padding: 4px 0px;
}

.chip-list {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
