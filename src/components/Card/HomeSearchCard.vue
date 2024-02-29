<script setup>
import { store, global } from '@/store';
</script>

<template>
  <var-card class="card">
    <template #description>
      <div class="card-description">
        <var-form>
          <var-input variant="outlined" size="small" :placeholder="$t('search')" v-model="store.search" clearable
            @change="store.renderList" @clear="store.renderList" @input="store.renderList" style="padding-bottom: 4px;" />
          <var-cell class="filter-cell">
            <var-select variant="outlined" size="small" :placeholder="$t('sort')" v-model="store.sort" clearable
              @close="store.renderList" @change="store.renderList" @clear="store.renderList">
              <var-option value="name" :label="$t('name')" />
              <var-option value="tier" :label="$t('tier')" />
              <template v-for="key in global.sortKeys">
                <var-option :value="key" :label="$t('stat_key.' + key)" />
              </template>
            </var-select>
            <template #extra>
              <var-button type="primary" @click="() => {store.order = !store.order; store.renderList()}">
                {{ store.order?$t('asc'):$t('desc') }}
              </var-button>
            </template>
          </var-cell>
          <template v-if="store.filters.length > 0">
            <var-divider> {{ $t('filters') }} </var-divider>
          </template>
          <template v-for="filter in store.filters">
            <var-cell class="filter-cell">
              <var-select :placeholder="$t(filter['k'])" v-model="filter['v']" variant="outlined" size="small" clearable
                :multiple="Array.isArray(filter['v'])" :chip="Array.isArray(filter['v'])" @close="store.renderList"
                @change="store.renderList" @clear="store.renderList">
                <template v-if="filter['k'] != undefined">
                  <template v-if="filter['k'] === 'category'">
                    <var-option :label="$t(`categories.${v}`)" :value="v" v-for="v in store.options[filter['k']]" />
                  </template>
                  <template v-else-if="filter['k'] === 'exotic'">
                    <var-option :label="v ? $t('yes') : $t('no')" :value="v" v-for="v in store.options[filter['k']]" />
                  </template>
                  <template v-else-if="filter['k'] === 'tier'">
                    <var-option :label="global.star + (v + 1)" :value="`${v + 1}`"
                      v-for="(_, v) in Array.from({ length: 10 })" />
                  </template>
                  <template v-else>
                    <var-option :label="v" :value="v" v-for="v in store.options[filter['k']]" />
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
      <var-menu placement="cover-bottom-end" close-on-click-reference v-model:show="show"
        v-if="store.options != undefined">
        <var-button type="primary" text> {{ $t('add') }} </var-button>
        <template #menu>
          <div style="overflow-y: scroll; max-height: 48vh;">
            <template v-for="[key, display], index in store.menus">
              <var-cell ripple @click="() => { addFilter(key); store.menus[index][1] = false; }" v-if="display">
                {{ $t(key) }}
              </var-cell>
            </template>
          </div>
        </template>
      </var-menu>
    </template>
  </var-card>
</template>

<script>
export default {
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
      store.menus = Object.keys(store.options).map((key) => [key, true]);
      store.renderList();
    },
    addFilter(key) {
      store.filters.push({ 'k': key, 'v': global.dropOptions.includes(key) ? [] : undefined, })
      this.show = false;
    },
  }
}
</script>
