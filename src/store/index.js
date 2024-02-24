import { useStorage } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core';
import { reactive, computed } from 'vue'

import router from '@/router'

const ornaUrl = 'https://playorna.com';
const guideUrl = 'https://orna.guide';
const languageBased = 'en';

const elementColor = {
  Water: '#5facff',
  Earthen: '#0fab0f',
  Lightning: '#a59e46',
  Fire: "#ff8135",
  Dark: "#d900ff",
  Holy: "#ddd",
  Arcane: "#8e78ff",
  Dragon: "#FF9800",
}

const singleOptions = ['category', 'tier', 'exotic', 'rarity', 'useable_by', 'family', 'spell_type', 'place'];
const arrayOptions = ['event', 'tags'];
const dropOptions = ['causes', 'cures', 'gives', 'immunities'];
// const tagsOptions = ['items', 'raids', 'spells'];

export const global = {
  ornaUrl: ornaUrl,
  staticUrl: `${ornaUrl}/static`,
  guideUrl: guideUrl,
  guideApiUrl: `${guideUrl}/api/v1`,
  star: '★',
  languageBased: languageBased,
  elementColor: elementColor,
  singleOptions: singleOptions,
  arrayOptions: arrayOptions,
  dropOptions: dropOptions,
}

export const store = reactive({
  homeTop: 0,
  state: useStorage('fqegg.top', {
    language: null,
    theme: null,
  }),
  codexPage: {
    category: undefined,
    id: undefined,
  },
  codex: {
    meta: undefined,
    data: {},
    materials: computed(() => new Set(Object.keys(store.codex.meta['upgrade_materials']))),
    spells: computed(() => new Set(Object.keys(store.codex.meta['skills']))),
    offhand_skills: computed(() => new Set(Object.keys(store.codex.meta['offhand_skills']))),
    offhand_items: computed(() => new Set(Object.keys(store.codex.meta['offhand_items']))),
    isMaterial: () => store.codex.materials.has(store.codexPage.id),
    isSkill: () => store.codex.spells.has(store.codexPage.id),
    isOffhandSkill: () => store.codex.offhand_skills.has(store.codexPage.id),
    isOffhandItem: () => store.codex.offhand_items.has(store.codexPage.id),
    based: computed(() => store.codex.data[languageBased]),
    basedItem: computed(() => store.codex.based[store.codexPage.category][store.codexPage.id]),
    used: computed(() => store.codex.data[store.state.language]),
    usedItem: computed(() => store.codex.used[store.codexPage.category][store.codexPage.id]),
    url: computed(() => `/codex/${store.codexPage.category}/${store.codexPage.id}/`),
    filtered: computed(() => store.codex.index.filter(([category, id]) => {
      if (store.codex.used[category][id])
        return store.codex.used[category][id]['name'].includes(store.search) || (store.codex.used[category][id]['description'] != undefined && store.codex.used[category][id]['description'].includes(store.search))
    }).filter(([category, id]) => {
      return store.filters.every((filter) => {
        if (singleOptions.includes(filter['k'])) {
          if (filter['v'] === undefined) { return true }
          if (filter['k'] === 'exotic') { return store.codex.used[category][id][filter['k']] === filter['v']; }
          return store.codex.used[category][id][filter['k']] !== undefined && store.codex.used[category][id][filter['k']] === filter['v']
        }
        if (arrayOptions.includes(filter['k'])) {
          if (filter['v'] === undefined) { return true }
          return store.codex.used[category][id][filter['k']] !== undefined && store.codex.used[category][id][filter['k']].includes(filter['v'])
        }
        if (dropOptions.includes(filter['k'])) {
          if (filter['v'] === undefined) { return true }
          if (filter['v'].length === 0) { return true }
          if (store.codex.used[category][id][filter['k']] !== undefined) {
            return filter['v'].every((v) => {
              return store.codex.used[category][id][filter['k']].some((f) => f['name'] === v);
            })
          }
          else {
            return false;
          }
        }
      })
    })),
    index: computed(() => {
      let index = [];
      for (const [category, items] of Object.entries(store.codex.used)) {
        for (const id of Object.keys(items)) {
          index.push([category, id]);
        }
      }
      return index;
    }),
  },
  options: undefined,
  search: '',
  filters: [],
  list: {
    loading: false,
    finished: false,
    content: [],
    index: 0,
  },
  renderList: useDebounceFn(() => {
    store.clearList();
    store.loadList();
  }, 500, { maxWait: 1000 }),
  loadList() {
    store.list.loading = true;
    const codexLength = store.codex.filtered.length;
    const chunkSize = 40;
    const minChunk = Math.min(chunkSize, codexLength - store.list.index);
    for (let i = 0; i < minChunk; i++) {
      store.list.content.push(store.codex.filtered[store.list.index + i]);
    };
    store.list.index += minChunk;
    store.list.loading = false;
    if (store.list.index >= codexLength) {
      store.list.finished = true;
    };
  },
  clearList() {
    store.list.content = [];
    store.list.index = 0;
    store.list.finished = false;
  },
  menus: undefined,
  buildOptions() {
    store.options = {
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
    
    store.filters = [];
    store.search = '';
    store.menus = Object.keys(store.options).map((key) => [key, true]);
    for (const items of Object.values(store.codex.used)) {
      for (const item of Object.values(items)) {
        store.updateOptions(item);
      }
    }
  },
  updateOptions(item) {
    // single      
    for (const option of singleOptions) {
      store.addOption(item, option);
    }
    // array
    for (const option of arrayOptions) {
      store.addOption(item, option);
    }

    // drop
    for (const option of dropOptions) {
      if (item[option] != undefined) {
        for (const t of item[option]) {
          store.options[option].add(t['name']);
        }
      }
    }
  },
  addOption(item, key) {
    if (item[key] != undefined) {
      if (typeof item[key] == 'object') {
        for (const t of item[key]) {
          store.options[key].add(t);
        }
      }
      else {
        store.options[key].add(item[key]);
      }
    }
  },
  guide: {
    cache: undefined,
  },
  enterCodex(category, id) {
    router.push({
      path: `/codex/${category}/${id}/`
    });
  },
  codexViewLoading: true,
})