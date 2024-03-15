import { useStorage } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core';
import { reactive, computed } from 'vue'

import router from '@/router'

const ornaUrl = 'https://playorna.com';
const guideUrl = 'https://orna.guide';
const languageBased = 'en';

const elementColor: any = {
  water: '#5facff',
  earthen: '#0fab0f',
  lightning: '#a59e46',
  fire: '#ff8135',
  dark: '#d900ff',
  holy: '#ddd',
  arcane: '#8e78ff',
  dragon: '#FF9800',
}

const singleOptions = ['category', 'tier', 'exotic', 'rarity', 'useable_by', 'family', 'spell_type', 'place'];
const arrayOptions = ['event', 'tags'];
const statusOptions = ['causes', 'cures', 'gives', 'immunities'];
// const tagsOptions = ['items', 'raids', 'spells'];

const stat_precent_keys = new Set(['ward', 'crit', 'gold_bonus',
  'follower_stats', 'luck_bonus', 'view_distance', 'summon_stats',
  'follower_act', 'exp_bonus', 'orn_bonus', 'monster_attraction']);

const sortKeys = ['attack', 'magic', 'defense', 'resistance', 'dexterity', 'crit',
  'hp', 'mana', 'ward', 'foresight', 'orn_bonus', 'exp_bonus', 'luck_bonus', 'gold_bonus',
  'follower_stats', 'follower_act', 'summon_stats',
  'view_distance', 'adornment_slots', 'monster_attraction',];

// const notTransKeys = ['name', 'description', 'bestial_bond', 'abilities'];

type Index = Array<[string, string]>;

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
  statusOptions: statusOptions,
  sortKeys: sortKeys,
  sortKeysSet: new Set(sortKeys),
}

export const store: any = reactive({
  homeTop: 0,
  codexTop: {},
  state: useStorage('fqegg.top', {
    language: null,
    theme: null,
  }),
  codexPage: {
    category: undefined,
    id: undefined,
  },
  codex: {
    extra: undefined,  // 'not_trans_keys', 'icons', 'miss_entries', 
                      // 'upgrade_materials', 'skills', 'offhand_skills', 'offhand_items'
    base: {},  // {lang: notTransKeys}
    data: {},  // {category: {id: item}}
    materials: computed(() => new Set(Object.keys(store.codex.extra['upgrade_materials']))),
    spells: computed(() => new Set(Object.keys(store.codex.extra['skills']))),
    offhand_skills: computed(() => new Set(Object.keys(store.codex.extra['offhand_skills']))),
    offhand_items: computed(() => new Set(Object.keys(store.codex.extra['offhand_items']))),
    miss_entries: computed(() => new Set(Object.keys(store.codex.extra['miss_entries']))),
    icons: computed(() => store.codex.extra.icons),
    isMaterial: () => store.codex.materials.has(store.codexPage.id),
    isSkill: () => store.codex.spells.has(store.codexPage.id),
    isOffhandSkill: () => store.codex.offhand_skills.has(store.codexPage.id),
    isOffhandItem: () => store.codex.offhand_items.has(store.codexPage.id),
    isMissEntry: (entry: string) => store.codex.miss_entries.has(`${store.state.language}/${entry}`),
    getMissEntry: (entry: string) => store.codex.extra['miss_entries'][`${store.state.language}/${entry}`],
    based: computed(() => store.codex.base[store.state.language]),
    basedItem: computed(() => store.codex.based[store.codexPage.category][store.codexPage.id]),
    used: computed(() => store.codex.data),
    usedItem: computed(() => store.codex.used[store.codexPage.category][store.codexPage.id]),
    url: computed(() => `/codex/${store.codexPage.category}/${store.codexPage.id}/`),
    filtered: computed(function (): Array<[string, string]> {
      return store.codex.index.filter(([category, id]: [string, string]) => {
        if (store.codex.used[category][id]) {
          const search = new RegExp(store.search, 'i')
          return search.test(store.codex.based[category][id]['name']) || (store.codex.based[category][id]['description'] != undefined && search.test(store.codex.based[category][id]['description']))
        }
      }).filter(([category, id]: [string, string]) => {
        return store.filters.every((filter: any) => {
          if (singleOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            if (filter['k'] === 'exotic') { return store.codex.used[category][id][filter['k']] === filter['v']; }
            return store.codex.used[category][id][filter['k']] !== undefined && store.codex.used[category][id][filter['k']] === filter['v']
          }
          if (arrayOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            return store.codex.used[category][id][filter['k']] !== undefined && store.codex.used[category][id][filter['k']].includes(filter['v'])
          }
          if (statusOptions.includes(filter['k'])) {
            if (filter['v'] === undefined) { return true }
            if (filter['v'].length === 0) { return true }
            if (store.codex.used[category][id][filter['k']] !== undefined) {
              return filter['v'].every((v: string) => {
                return store.codex.used[category][id][filter['k']].some((f: any) => f['name'] === v);
              })
            }
            else {
              return false;
            }
          }
        })
      })
    }),
    sorted: computed(() => {
      return (store.sort === undefined) ? store.codex.filtered : store.codex.filtered.toSorted((a: string, b: string) => {
        if (store.sort === 'name') {
          const itemA = store.codex.based[a[0]][a[1]];
          const itemB = store.codex.based[b[0]][b[1]];
          if (store.order) {
            return itemA['name'].localeCompare(itemB['name']);
          } else {
            return itemB['name'].localeCompare(itemA['name']);
          }
        }
        const itemA = store.codex.used[a[0]][a[1]];
        const itemB = store.codex.used[b[0]][b[1]];
        if (store.sort === 'tier') {
          if (store.order) {
            return itemA['tier'] - itemB['tier'];
          } else {
            return itemB['tier'] - itemA['tier'];;
          }
        }
        if (itemA['stats'] === undefined || itemA['stats'][store.sort] === undefined) {
          return 1;
        }
        if (itemB['stats'] === undefined || itemB['stats'][store.sort] === undefined) {
          return -1;
        }
        return (() => {
          if (stat_precent_keys.has(store.sort)) {
            return itemA['stats'][store.sort].slice(0, -1) - itemB['stats'][store.sort].slice(0, -1);
          }
          return itemA['stats'][store.sort] - itemB['stats'][store.sort];
        })() * (store.order ? 1 : -1)
      })
    }),
    index: computed(function (): Index {
      const index: any[] = [];
      for (const [category, items] of (Object.entries(store.codex.used) as Array<[string, any]>)) {
        for (const id of Object.keys(items)) {
          index.push([category, id]);
        }
      }
      return index;
    }),
  },
  options: undefined,
  search: '',
  filters: [] as Array<any>,
  sort: undefined,
  order: false,
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
    const codexLength = store.codex.sorted.length;
    const chunkSize = 40;
    const minChunk = Math.min(chunkSize, codexLength - store.list.index);
    for (let i = 0; i < minChunk; i++) {
      store.list.content.push(store.codex.sorted[store.list.index + i]);
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

    // store.filters = [];
    store.search = '';
    store.menus = Object.keys(store.options).map((key) => [key, true]);
    for (const items of (Object.values(store.codex.used) as Array<[string, any]>)) {
      for (const item of Object.values(items)) {
        store.updateOptions(item);
      }
    }
  },
  updateOptions(item: any) {
    // single      
    for (const option of singleOptions) {
      store.addOption(item, option);
    }
    // array
    for (const option of arrayOptions) {
      store.addOption(item, option);
    }

    // drop
    for (const option of statusOptions) {
      if (item[option] != undefined) {
        for (const t of item[option]) {
          store.options[option].add(t['name']);
        }
      }
    }
  },
  addOption(item: any, key: string) {
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
  enterCodex(category: string, id: string) {
    router.push({
      path: `/codex/${category}/${id}/`
    });
  },
  codexViewLoading: true,
})