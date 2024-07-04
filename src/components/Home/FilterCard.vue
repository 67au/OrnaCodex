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
          <var-cell class="filter-cell">
            <var-input
              class="w-full"
              variant="outlined"
              size="small"
              :placeholder="$t('search')"
              v-model="filtersState.search"
              clearable
            />
            <template #extra>
              <var-chip
                size="large"
                type="primary"
                class="whitespace-nowrap"
                elevation="2"
                @click="() => (show.sortDefault = !show.sortDefault)"
              >
                <div class="-m-3 text-md">
                  <template v-if="sortState.default.name === 'default'">
                    {{ $t('sortDefault') }}
                  </template>
                  <template v-else>
                    {{ $t(sortState.default.name) }}
                  </template>
                </div>
                <template #right>
                  <template v-if="sortState.default.name !== 'default'">
                    <Icon
                      class="-m-3 ml-2 text-lg"
                      v-if="sortState.default.asc"
                      icon-class="i-mdi-arrow-upward"
                    />
                    <Icon class="-m-3 ml-2 text-lg" v-else icon-class="i-mdi-arrow-downward" />
                  </template>
                </template>
              </var-chip>
            </template>
          </var-cell>

          <var-cell class="filter-cell min-h-8">
            <var-space justify="space-between" align="center" class="pt-1">
              <var-space justify="flex-start" align="center" size="small">
                <var-chip
                  class="text-md"
                  type="primary"
                  elevation="2"
                  @click="() => (show.sort = !show.sort)"
                  v-if="sortState.name === undefined"
                >
                  <template #left>
                    <Icon icon-class="i-mdi-sort text-lg" />
                  </template>
                  <div>{{ $t('sort') }}</div>
                </var-chip>
                <var-chip
                  class="text-md"
                  type="success"
                  elevation="2"
                  @click="() => (show.sort = !show.sort)"
                  v-else
                >
                  <template #left>
                    <Icon icon-class="i-mdi-sort text-lg" />
                  </template>
                  <div>
                    {{ $t(`meta.stats.${sortState.name}`) }}
                  </div>
                </var-chip>
              </var-space>
              <var-space justify="flex-end" align="center" size="small">
                <var-tooltip placement="top" :content="$t(sortState.asc ? 'asc' : 'desc')">
                  <PopupButton
                    type="warning"
                    :icon-class="sortState.asc ? 'i-mdi-arrow-up' : 'i-mdi-arrow-down'"
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
                  <var-menu
                    placement="bottom-end"
                    close-on-click-reference
                    v-model:show="show.menu"
                    v-if="optionsState.options != undefined"
                  >
                    <PopupButton type="primary" icon-class="i-mdi-add" />
                    <template #menu>
                      <div class="overflow-y-auto max-h-50vh">
                        <template v-for="([key, display], index) in optionsState.menu">
                          <var-cell
                            ripple
                            @click="
                              () => {
                                filtersState.addFilter(index)
                                show.menu = false
                              }
                            "
                            v-if="display"
                            :key="key"
                          >
                            {{ `${$t(key)} ${getMultipleTag(key)}` }}
                          </var-cell>
                        </template>
                      </div>
                    </template>
                  </var-menu>
                </var-tooltip>
              </var-space>
            </var-space>
          </var-cell>

          <var-cell class="filter-cell" v-for="filter in filtersState.filters" :key="filter.key">
            <var-select
              :placeholder="`${$t(filter.key)}${getMultipleTag(filter.key)}`"
              v-model="filter.value"
              variant="outlined"
              size="small"
              clearable
              :multiple="Array.isArray(filter.value) && filter.key !== 'exotic'"
              :chip="Array.isArray(filter.value)"
            >
              <template v-if="filter.key !== undefined">
                <template v-if="filter.key === 'category'">
                  <var-option
                    :label="$t(`categories.${v}`)"
                    :value="v"
                    v-for="v in optionsState.options[filter.key]"
                    :key="v"
                  />
                </template>

                <template v-else-if="filter.key === 'exotic'">
                  <var-option
                    :label="v ? $t('yes') : $t('no')"
                    :value="v"
                    v-for="v in optionsState.options[filter.key]"
                    :key="v"
                  />
                </template>

                <template v-else-if="filter.key === 'tier'">
                  <var-option
                    :label="getTierName(v + 1)"
                    :value="`${v + 1}`"
                    v-for="(_, v) in Array.from({ length: 10 })"
                    :key="v"
                  />
                </template>

                <template v-else-if="isStatusKey(filter.key)">
                  <var-option
                    :label="$t(`meta.status.${v}`)"
                    :value="v"
                    v-for="v in sortOptions(filter.key)"
                    :key="v"
                  />
                </template>

                <template v-else>
                  <var-option
                    :label="$t(`meta.${filter.key}.${v}`)"
                    :value="v"
                    v-for="v in sortOptions(filter.key)"
                    :key="v"
                  />
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
  </var-card>

  <PopupPaper v-model:show="show.sort">
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

  <PopupPaper v-model:show="show.sortDefault">
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
          return this.$t(`meta.status.${a}`).localeCompare(this.$t(`meta.status.${b}`))
        })
      } else {
        options.sort((a: string, b: string) => {
          return this.$t(`meta.${key}.${a}`).localeCompare(this.$t(`meta.${key}.${b}`))
        })
      }
      return options
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
