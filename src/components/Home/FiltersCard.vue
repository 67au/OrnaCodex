<script setup lang="ts">
import { useFiltersState } from '@/stores/filters'
import { useOptionsState } from '@/stores/options'
import { getTierName } from '@/plugins/utils'
import { useSortState } from '@/stores/sort'
import { useCodexState } from '@/stores/codex'
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
                  :type="sortState.sort.name === undefined ? 'default' : 'success'"
                  elevation="2"
                  @click="() => (show.sort = !show.sort)"
                >
                  <template #left>
                    <div
                      v-if="sortState.sort.name === undefined"
                      class="text-lg i-mdi-view-dashboard-edit"
                    ></div>
                  </template>
                  <div v-if="sortState.nameTuple === undefined">
                    {{ defaultLabel }}
                  </div>
                  <div v-else>
                    {{ $t(`meta.stats.${sortState.nameTuple[1] as string}`) }}
                  </div>
                </var-chip>
              </var-space>
              <var-space justify="flex-end" align="center" size="small">
                <var-tooltip placement="top" :content="$t(sortState.sort.asc ? 'asc' : 'desc')">
                  <PopupButton
                    type="warning"
                    :icon-class="
                      sortState.sort.asc ? 'i-mdi-sort-ascending' : 'i-mdi-sort-descending'
                    "
                    @click="() => (sortState.sort.asc = !sortState.sort.asc)"
                  />
                </var-tooltip>
                <var-tooltip placement="top" :content="$t('clear')">
                  <PopupButton
                    type="danger"
                    icon-class="i-mdi-trash"
                    @click="
                      () => {
                        sortState.reset()
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
                <var-tooltip placement="top" :content="$t('share')">
                  <PopupButton
                    type="info"
                    icon-class="i-mdi-share-variant"
                    @click="show.share = true"
                  />
                </var-tooltip>
                <var-tooltip placement="top" :content="$t('multiple')">
                  <PopupButton
                    :type="filtersState.multiple ? 'success' : 'default'"
                    :icon-class="filtersState.multiple ? 'i-mdi-tag-multiple' : 'i-mdi-tag'"
                    @click="
                      () => {
                        filtersState.switchMultiple()
                      }
                    "
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
              v-if="Array.isArray(filter.value)"
              :placeholder="getTag(key)"
              v-model="filter.value"
              variant="outlined"
              size="small"
              clearable
              multiple
              chip
              :options="optionsMap[key]"
            />
            <var-select
              v-else
              :placeholder="getTag(key)"
              v-model="filter.value"
              variant="outlined"
              size="small"
              clearable
              :options="optionsMap[key]"
            />
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
          {{ getTag(key) }}
        </var-chip>
      </var-space>
    </var-paper>
  </PopupPaper>

  <SortSelect v-model:show="show.sort" />
  <SortDefaultSelect v-model:show="show.sortDefault" />
  <ShareUrl v-model:show="show.share" />
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      show: {
        menu: false,
        sort: false,
        sortDefault: false,
        share: false
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
    codexState() {
      return useCodexState()
    },
    defaultLabel() {
      return this.$t('query.qualitylabel.default')
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
          if (key === 'element') {
            return [
              key,
              Array.from(value as Set<string>).map((v: string) => {
                return { label: this.$t(`meta.stats.${v}`), value: v }
              })
            ]
          }
          if (key === 'abilities') {
            return [
              key,
              Array.from(value as Set<string>)
                .sort((a: string, b: string) => {
                  return this.codexState.abilities[a].name.localeCompare(
                    this.codexState.abilities[b].name
                  )
                })
                .map((v: string) => {
                  return { label: this.codexState.abilities[v].name, value: v }
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
    getTag(key: string) {
      return `${this.$t(`${this.isStatusKey(key) ? 'meta.' : ''}${key}`)}`
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
</style>
