<script setup lang="ts">
import SettingDialog from '@/components/shared/SettingDialog.vue'
import config from '@/config'
import { useCodexState } from '@/stores/codex'
import { useSortState } from '@/stores/sort'
import { customSort, getOptionValueName, getSortName } from '@/utils'
import { mdiClose, mdiMagnify, mdiRestore } from '@mdi/js'
import { isNull, mapValues } from 'es-toolkit'
import { every, isEmpty } from 'es-toolkit/compat'

const searchExpand = shallowRef(false)
const search: ShallowRef<string | null> = shallowRef(null)
const sortState = useSortState()

const sorts = computed(() => {
  const codexState = useCodexState()
  const r = mapValues(codexState.meta.sorts, (keys, key) => {
    if (key === 'items') {
      keys.sort((a, b) => customSort(a, b, config.baseStatMap))
    }
    return keys.map((s) => {
      return {
        key: s,
        name: getSortName(s),
      }
    })
  })
  return r
})

const sortsFiltered = computed(() => {
  if (isNull(search.value)) {
    return sorts.value
  }
  const pattern = new RegExp(search.value, 'i')
  return mapValues(sorts.value, (value) =>
    value.filter((s) => {
      if (search.value === '') {
        return true
      }
      return pattern.test(s.name)
    }),
  )
})

const isEmptySorts = computed(() => every(Object.values(sortsFiltered.value), (v) => isEmpty(v)))

function expandSearch() {
  searchExpand.value = true
}

function closeSearch() {
  searchExpand.value = false
  search.value = ''
}
</script>

<template>
  <SettingDialog :title="$t('sorts.title')">
    <template v-slot:activator="{ props: activator }">
      <slot name="activator" :activator="activator"></slot>
    </template>

    <template v-slot:content>
      <v-text-field
        :prepend-inner-icon="mdiMagnify"
        ref="input"
        v-model="search"
        :label="$t('filters.search')"
        density="compact"
        class="px-2 my-2"
        hide-details
        variant="filled"
        single-line
        :append-inner-icon="mdiClose"
        @click:append-inner="closeSearch"
        clearable
        :clear-icon="mdiRestore"
        autofocus
        v-if="searchExpand"
      >
      </v-text-field>
      <template v-else>
        <v-toolbar-title>{{ $t('sorts.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn :icon="mdiMagnify" @click="expandSearch"></v-btn>
      </template>
    </template>

    <template v-slot:default="{ isActive }">
      <v-list>
        <template v-for="(sorts, key, index) in sortsFiltered" :key="index">
          <template v-if="!isEmpty(sorts)">
            <v-list-item
              :title="getOptionValueName('category', key)"
              density="compact"
              class="py-0"
            ></v-list-item>
            <v-list-item>
              <v-chip-group color="secondary" mandatory v-model="sortState.key" column>
                <template v-for="(sort, index) in sorts" :key="index">
                  <v-chip
                    :value="sort.key"
                    rounded="lg"
                    :text="sort.name"
                    @click="
                      () => {
                        sortState.category = key as string
                        isActive.value = false
                      }
                    "
                  ></v-chip>
                </template>
              </v-chip-group>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </template>
        <v-empty-state v-if="isEmptySorts" :icon="mdiMagnify" :title="$t('helper.notFound')" />
      </v-list>
    </template>
  </SettingDialog>
</template>
