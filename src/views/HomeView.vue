<script setup>
import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { store, global } from '@/store'
</script>

<template>
  <main>
    <div class="container">
      <var-card class="card">
        <template #description>
          <div class="card-description" v-if="!loading">
            <var-form>
              <var-input variant="outlined" size="small" :placeholder="$t('search')" v-model="search" clearable
                @change="applyFilter" @clear="applyFilter" @input="applyFilter" />
              <template v-if="filters.length > 0">
                <var-divider> {{ $t('filters') }} </var-divider>
              </template>
              <template v-for="filter in filters">
                <var-cell class="item-cell">
                  <var-select :placeholder="$t(filter['k'])" v-model="filter['v']" variant="outlined" size="small"
                    clearable :multiple="Array.isArray(filter['v'])" :chip="Array.isArray(filter['v'])"
                    @close="applyFilter" @change="applyFilter" @clear="applyFilter">
                    <template v-if="filter['k'] != undefined">
                      <template v-if="filter['k'] === 'category'">
                        <var-option :label="$t(`categories.${v}`)" :value="v" v-for="v in options[filter['k']]" />
                      </template>
                      <template v-else-if="filter['k'] === 'exotic'">
                        <var-option :label="v ? $t('yes') : $t('no')" :value="v" v-for="v in options[filter['k']]" />
                      </template>
                      <template v-else-if="filter['k'] === 'tier'">
                        <var-option :label="global.star + (v + 1)" :value="`${v + 1}`"
                          v-for="(_, v) in Array.from({ length: 10 })" />
                      </template>
                      <template v-else>
                        <var-option :label="v" :value="v" v-for="v in options[filter['k']]" />
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
              </template>
            </var-form>
          </div>
        </template>
        <template #extra>
          <var-button type="primary" text @click="resetFilters"> {{ $t('clear') }} </var-button>
          <var-menu placement="cover-bottom-end" close-on-click-reference v-model:show="adding"
            v-if="options != undefined">
            <var-button type="primary" text> {{ $t('add') }} </var-button>
            <template #menu>
              <div style="overflow-y: scroll; max-height: 300px;">
                <template v-for="[key, show], index in menus">
                  <var-cell ripple @click="() => { addFilter(key); menus[index][1] = false; }" v-if="show">
                    {{ $t(key) }}
                  </var-cell>
                </template>
              </div>
            </template>
          </var-menu>
        </template>
      </var-card>
      <var-card class="card">
        <template #title>
          <var-space justify="flex-end">
            <var-chip size="small" :round="false">
              <template #left>
                <var-icon name="magnify" size="16" />
              </template>
              {{ codexFiltered.length }}
            </var-chip>
          </var-space>
        </template>
        <template #description>
          <div class="card-description">
            <var-list :finished="list.finished" v-model:loading="list.loading" @load="loadList" :offset="200">
              <template v-for="[category, id] in list.content">
                <var-cell class="item-cell" border @click="() => store.enterCodex(category, id)">
                  <template #icon>
                    <var-icon class="append-icon" :size="48"
                      :name="`${global.staticUrl}${codex[category][id]['icon']}`" />
                  </template>
                  <template #description>
                    {{ codex[category][id]['name'] }}
                    <br>
                    <var-space size="mini" style="line-height: 120%;">
                      <var-chip type="warning" size="mini" :round="false" plain>{{ global.star +
                        codex[category][id]['tier']
                      }}</var-chip>
                      <var-chip type="primary" size="mini" :round="false" plain>{{
                        $t(`categories.${codex[category][id]['category']}`) }}</var-chip>
                      <template v-if="codex[category][id]['event'] != undefined">
                        <var-chip class="highlight" size="mini" :round="false" plain
                          v-for="event in codex[category][id]['event']">
                          <span class="event">{{ event }}</span>
                        </var-chip>
                      </template>
                    </var-space>
                  </template>
                  <template #extra>
                  </template>
                </var-cell>
              </template>
            </var-list>
          </div>
        </template>
      </var-card>
    </div>
  </main>
</template>

<script>
const singleOptions = ['category', 'tier', 'exotic', 'rarity', 'useable_by', 'family', 'spell_type', 'place'];
const arrayOptions = ['event', 'tags'];
const dropOptions = ['causes', 'cures', 'gives', 'immunities'];
const tagsOptions = ['items', 'raids', 'spells'];

export default {
  mounted() {
    this.loading = true;
    this.buildIndex();
    this.buildOptions();
    this.applyFilter();
    this.loading = false;

    watch(() => this.$i18n.locale, (newVal, oldVal) => {
      this.loading = true;
      this.buildOptions();
      this.applyFilter();
      this.loading = false;
    });
  },
  data() {
    return {
      store,
      dropOptions,
      search: '',
      options: undefined,
      filters: [],
      codexFiltered: [],
      codexIndex: [],
      list: {
        loading: false,
        finished: false,
        content: [],
        index: 0,
      },
      loading: true,
      adding: false,
      menus: undefined,
      handleSearch: useDebounceFn(() => {
        this.applyFilter();
      }, 500, { maxWait: 1000 }),
      renderList: useDebounceFn(() => {
        this.clearList();
      }, 500, { maxWait: 1000 })
    }
  },
  methods: {
    buildIndex() {
      for (const [category, items] of Object.entries(this.codex)) {
        for (const id of Object.keys(items)) {
          this.codexIndex.push([category, id]);
        }
      }
    },
    buildOptions() {
      this.options = {
        category: new Set(),
        tier: new Set(),
        exotic: new Set(),
        rarity: new Set(),
        useable_by: new Set(),
        family: new Set(),
        spell_type: new Set(),
        place: new Set(),
        // array
        event: new Set(),
        tags: new Set(),
        // drop
        causes: new Set(),
        cures: new Set(),
        gives: new Set(),
        immunities: new Set(),
      };
      this.filters = [];
      this.menus = Object.keys(this.options).map((key) => [key, true]);
      for (const items of Object.values(this.codex)) {
        for (const item of Object.values(items)) {
          this.updateOptions(item);
        }
      }
    },
    applyFilter() {
      this.codexFiltered = this.codexIndex.filter(([category, id]) => {
        return this.codex[category][id]['name'].includes(this.search) || (this.codex[category][id]['description'] != undefined && this.codex[category][id]['description'].includes(this.search))
      }).filter(([category, id]) => {
        return this.filters.every((filter) => {
          if (singleOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            if (filter['k'] === 'exotic') { return this.codex[category][id][filter['k']] === filter['v']; }
            return this.codex[category][id][filter['k']] !== undefined && this.codex[category][id][filter['k']] === filter['v']
          }
          if (arrayOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            return this.codex[category][id][filter['k']] !== undefined && this.codex[category][id][filter['k']].includes(filter['v'])
          }
          if (dropOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            if (filter['v'].length === 0) { return true }
            if (this.codex[category][id][filter['k']] !== undefined) {
              return filter['v'].every((v) => {
                return this.codex[category][id][filter['k']].some((f) => f['name'] === v);
              })
            }
            else {
              return false;
            }
          }
        })
      })
    },
    resetFilters() {
      this.filters = [];
      this.search = '';
      this.menus = Object.keys(this.options).map((key) => [key, true]);
      this.applyFilter();
    },
    updateOptions(item) {
      // single      
      for (const option of singleOptions) {
        this.addOption(item, option);
      }
      // array
      this.addOption(item, 'event');
      this.addOption(item, 'tags');
      // drop
      for (const option of dropOptions) {
        if (item[option] != undefined) {
          for (const t of item[option]) {
            this.options[option].add(t['name']);
          }
        }
      }
    },
    addOption(item, key) {
      if (item[key] != undefined) {
        if (typeof item[key] == 'object') {
          for (const t of item[key]) {
            this.options[key].add(t);
          }
        }
        else {
          this.options[key].add(item[key]);
        }
      }
    },
    addFilter(key) {
      this.filters.push({ 'k': key, 'v': dropOptions.includes(key) ? [] : undefined, })
      this.adding = false;
    },
    loadList() {
      const codexLength = this.codexFiltered.length;
      const chunkSize = 30;
      const minChunk = Math.min(chunkSize, codexLength - this.list.index);
      for (let i = 0; i < minChunk; i++) {
        this.list.content.push(this.codexFiltered[this.list.index + i]);
      };
      this.list.index += minChunk;
      this.list.loading = false;
      if (this.list.index >= codexLength) {
        this.list.finished = true;
      };
    },
    clearList() {
      this.list.content = [];
      this.list.index = 0;
      this.list.finished = false;
      this.list.loading = true;
      this.loadList();
    },
  },
  computed: {
    codex() {
      return store.codex.data['codex'][store.lang];
    },
  },
  watch: {
    codexFiltered: {
      handler(newValue, oldValue) {
        this.renderList();
      },
    },
  },
}
</script>

<style scoped>

</style>
