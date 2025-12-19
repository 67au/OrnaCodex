<script setup lang="ts">
import { useCodexState } from '@/stores/codex'
import { useSortState } from '@/stores/sort'
import { customSort, getOptionValueName, getSortName } from '@/plugins'
import { mdiClose, mdiCloseCircle, mdiMagnify, mdiRestart, mdiSort } from '@mdi/js'
import { every, isEmpty } from 'es-toolkit/compat'

const dialog = shallowRef(false)
const expand = ref(false)
const search = ref('')
const searchPattern = computed(() => new RegExp(search.value, 'i'))
const codexState = useCodexState()
const sortState = useSortState()

const inputRef = useTemplateRef('input')

const sorts = computed(() =>
  Object.entries(codexState.sorts)
    .map(([key, sorts]): [string, Array<string>] => {
      if (key === 'items') {
        return [key, Object.keys(sorts).sort((a, b) => customSort(a, b, sortState.baseStatsMap))]
      }
      return [key, Object.keys(sorts)]
    })
    .map(([key, sorts]): [string, Array<{ key: string; name: string }>] => {
      return [
        key,
        sorts.map((s) => {
          return {
            key: s,
            name: getSortName(s),
          }
        }),
      ]
    }),
)

const sortKeys = computed(() =>
  sorts.value.map(([category, keys]): [string, Array<{ key: string; name: string }>] => {
    return [
      category,
      keys.filter((s) => {
        if (search.value === '') {
          return true
        }
        return searchPattern.value.test(s.name)
      }),
    ]
  }),
)
const isEmptyArray = computed(() => every(Object.values(sortKeys.value), (v) => isEmpty(v[1])))

function expandSearch() {
  expand.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function closeSearch() {
  expand.value = false
  search.value = ''
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    close-on-back
    opacity="0.1"
    scrollable
    :fullscreen="$vuetify.display.smAndDown"
    :transition="$vuetify.display.smAndDown ? 'dialog-bottom-transition' : 'fade-transition'"
    :max-width="$vuetify.display.smAndDown ? undefined : 600"
  >
    <template v-slot:activator="{ props: activator }">
      <v-chip
        :prepend-icon="sortState.isActive ? undefined : mdiSort"
        color="secondary"
        rounded="lg"
        :text="sortState.isActive ? getSortName(sortState.key) : $t('tools.sort')"
        v-bind="activator"
      >
      </v-chip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card density="compact" :rounded="!$vuetify.display.smAndDown">
        <v-toolbar>
          <v-toolbar-title>{{ $t('tools.sort') }}</v-toolbar-title>
          <v-text-field
            :prepend-inner-icon="mdiMagnify"
            ref="input"
            v-model="search"
            :label="$t('tools.search')"
            density="compact"
            class="px-2 my-2"
            hide-details
            variant="filled"
            single-line
            :append-inner-icon="mdiClose"
            @click:append-inner="closeSearch"
            clearable
            :clear-icon="mdiRestart"
            @click:clear="search = ''"
            v-if="expand"
          >
          </v-text-field>
          <template v-slot:append>
            <div class="d-flex ga-1">
              <v-btn :icon="mdiMagnify" @click="expandSearch" v-if="!expand"></v-btn>
              <v-btn
                v-if="!$vuetify.display.smAndDown"
                :icon="mdiCloseCircle"
                @click="isActive.value = false"
              ></v-btn>
            </div>
          </template>
          <template v-slot:prepend>
            <v-btn
              v-if="$vuetify.display.smAndDown"
              :icon="mdiClose"
              @click="isActive.value = false"
            ></v-btn>
          </template>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list>
          <template v-for="([key, sorts], index) in sortKeys" :key="index">
            <template v-if="sorts.length > 0">
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
                    <v-divider v-if="search === '' && sort.key === sortState.lastStat"></v-divider>
                  </template>
                </v-chip-group>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </template>
          <v-empty-state
            v-if="isEmptyArray"
            :icon="mdiMagnify"
            :title="$t('help.notFound')"
          ></v-empty-state>
        </v-list>
      </v-card>
    </template>
  </v-dialog>
</template>
