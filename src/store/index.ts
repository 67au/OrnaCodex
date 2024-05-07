import { useDebounceFn } from '@vueuse/core';

import router from '@/router'
import { defineStore, storeToRefs } from 'pinia';
import { i18n } from '@/i18n';
import { assess, type Stats, type AssessQuery, type Stat } from '@/plugins/assess';
import { isMoreSlotsItem } from '@/plugins/utils';

const guideUrl = 'https://orna.guide';

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

const rarityAura: any = {
  uncommon: 'rare',
  rare: 'famed',
  storied: 'legendary',
  cryptid: 'masterforged',
  steward: 'demonforged',
};

// const notTransKeys = ['name', 'description', 'bestial_bond', 'abilities'];

export const global = {
  ornaUrl: __ORNA_URL__,
  staticUrl: __ORNA_STATIC_URL__,
  guideUrl: guideUrl,
  guideApiUrl: `${guideUrl}/api/v1`,
  star: '★',
  getTier: (tier: string | number) => `${global.star}${tier}`,
  elementColor: elementColor,
  rarityAura: rarityAura,
  enterCodex: (category: string, id: string) => router.push({ path: `/codex/${category}/${id}/` }),
  getStaticUrl: (url: string) => `${global.staticUrl}${url}`,
}

interface scrollTopMap {
  [key: string]: number;
}

export const useScrollTopState = defineStore('scrollTop', {
  state: () => ({
    home: 0,
    codex: {} as scrollTopMap,
  }),
  actions: {
    getCodexTop(category: string, id: string): number {
      return this.codex[`${category}/${id}`] || 0;
    },
    setCodexTop(category: string, id: string, top: number): void {
      this.codex[`${category}/${id}`] = top;
    }
  },
})

export interface CodexView {
  category: string,
  id: string,
}

export interface CodexMap<T> {
  [key: string]: T;
}

export interface CodexItem {
  [key: string]: any;
}

type CodexIndex = Array<CodexView>;

export const useCodexState = defineStore('codex', {
  state: () => ({
    meta: {} as CodexMap<CodexMap<CodexItem>>,
    langs: {} as CodexMap<any>,
    extra: {} as CodexMap<any>,
  }),
  getters: {
    materials: (state) => new Set(Object.keys(state.extra['upgrade_materials'])),
    spells: (state) => new Set(Object.keys(state.extra['skills'])),
    offhand_skills: (state) => new Set(Object.keys(state.extra['offhand_skills'])),
    offhand_items: (state) => new Set(Object.keys(state.extra['offhand_items'])),
    miss_entries: (state) => new Set(Object.keys(state.extra['miss_entries'])),
    icons: (state) => state.extra.icons,

    used: (state) => state.meta,
    lang: (state) => state.langs[i18n.global.locale.value],

    index(): CodexIndex {
      const index: CodexIndex = [];
      Object.entries(this.used).forEach(([category, items]) => {
        Object.keys(items).forEach((id) => {
          index.push({
            category: category,
            id: id,
          })
        })
      })
      return index;
    },

    filtered(): CodexIndex {
      const { search, filters } = storeToRefs(useFiltersState());
      const optionsState = useOptionsState();
      return this.index.filter(({ category, id }: CodexView) => {
        if (this.used[category][id]) {
          const searchKey = new RegExp(search.value, 'i');
          return searchKey.test(this.lang[category][id].name) || (this.lang[category][id].description !== undefined && searchKey.test(this.lang[category][id].description))
        }
      }).filter(({ category, id }: CodexView) => {
        return filters.value.every((filter: Filter) => {
          if (filter.value === undefined) { return true }
          if (optionsState.keys.single.includes(filter.key)) {
            if (filter.key === 'exotic') { return this.used[category][id][filter.key] === filter.value }
            return this.used[category][id][filter.key] !== undefined && this.used[category][id][filter.key] === filter.value;
          }
          if (optionsState.keys.array.includes(filter.key)) {
            return this.used[category][id][filter.key] !== undefined && this.used[category][id][filter.key].includes(filter.value);
          }
          if (optionsState.keys.status.includes(filter.key)) {
            if ((filter.value as Array<string>).length === 0) { return true }
            return (filter.value as Array<string>).every((value) => {
              return this.used[category][id][filter.key] !== undefined && this.used[category][id][filter.key].some((status: Status) => status.name === value);
            })
          }
        })
      })
    },
    sorted(): CodexIndex {
      const filtersState = useFiltersState();
      const { sort, asc } = storeToRefs(filtersState);
      const sortKey = sort.value as string;
      if (sortKey === undefined) {
        return this.filtered;
      } else {
        return this.filtered.toSorted((a, b) => {
          if (sortKey === 'name') {
            const A = this.lang[a.category][a.id];
            const B = this.lang[b.category][b.id];
            if (asc.value) {
              return A.name.localeCompare(B.name);
            } else {
              return B.name.localeCompare(A.name);
            }
          }
          const A = this.used[a.category][a.id];
          const B = this.used[b.category][b.id];
          if (sortKey === 'tier') {
            if (asc.value) {
              return A.tier - B.tier;
            } else {
              return B.tier - A.tier;
            }
          }
          if (A.stats === undefined || A.stats[sortKey] === undefined) { return 1 }
          if (B.stats === undefined || B.stats[sortKey] === undefined) { return -1 }
          return (() => {
            if (filtersState.isPercentSortKey()) {
              return A.stats[sortKey].slice(0, -1) - B.stats[sortKey].slice(0, -1);
            } else {
              return A.stats[sortKey] - B.stats[sortKey];
            }
          })() * (asc.value ? 1 : -1);
        })
      }
    },
  },
  actions: {
    isMissEntry(category: string, id: string) {
      return this.miss_entries.has(`${i18n.global.locale.value}/${category}/${id}`)
    },
    getMissEntry(category: string, id: string) {
      return this.extra.miss_entries[`${i18n.global.locale.value}/${category}/${id}`]
    },
  }
})

export const useCodexViewState = defineStore('codex-view', {
  state: () => ({
    page: {
      category: '',
      id: '',
    } as CodexView,
  }),
  getters: {
    url: (state) => `/codex/${state.page.category}/${state.page.id}/`,

    item(state): CodexItem {
      const codexState = useCodexState();
      return codexState.meta[state.page.category][state.page.id];
    },
    lang(state) {
      const codexState = useCodexState();
      return codexState.langs[i18n.global.locale.value][state.page.category][state.page.id];
    },

    statKeysSet(): Set<string> {
      return new Set(statKeys)
    },
    isAssessable(): boolean {
      return Object.keys(this.item['stats']).some((key) => this.statKeysSet.has(key))
    },

    isCelestial(): boolean {
      return this.item['rarity'] === 'celestial';
    },
    isWeapon(): boolean {
      return this.item['item_type'] === 'weapon';
    },
    isAccessory(): boolean {
      return this.item['place'] === 'accessory';
    },
    isArmor(): boolean {
      return this.item['item_type'] === 'armor';
    },
    isAdornment(): boolean {
      return this.item['item_type'] === 'adornment';
    },
    isUpgradable(): boolean {
      // wait for fix
      // return this.isWeapon || (this.isArmor && !this.isAccessory);
      return (this.isWeapon && !this.isAdornment) || (this.isArmor && !this.isAccessory);
    },
    isOffHand(): boolean {
      return this.item['place'] === 'off-hand';
    },
    isMoreSlots(): boolean {
      return this.isUpgradable && !this.isOffHand;
    },
    isCelestialWeapon(): boolean {
      return this.isCelestial && this.isWeapon;
    }
  },
  actions: {
    isMaterial() {
      const codexState = useCodexState();
      return codexState.materials.has(this.page.id);
    },
    isSkill() {
      const codexState = useCodexState();
      return codexState.spells.has(this.page.id);
    },
    isOffhandSkill() {
      const codexState = useCodexState();
      return codexState.offhand_skills.has(this.page.id);
    },
    isOffhandItem() {
      const codexState = useCodexState();
      return codexState.offhand_items.has(this.page.id);
    },
  }
})

interface OptionMap {
  [key: string]: Set<string | number>,
}

type Menu = Array<[string, boolean]>;

interface Status {
  name: string,
  icon: string,
  chance?: string,
}

interface OptionsKeys {
  single: Array<string>,
  array: Array<string>,
  status: Array<string>,
}

export const useOptionsState = defineStore('options', {
  state: () => ({
    options: {
      category: new Set(),
      tier: new Set(),
      exotic: new Set(),
      rarity: new Set(),
      useable_by: new Set(),
      family: new Set(),
      spell_type: new Set(),
      item_type: new Set(),
      place: new Set(),
      // array
      event: new Set(),
      tags: new Set(),
      // drop
      causes: new Set(),
      cures: new Set(),
      gives: new Set(),
      immunities: new Set(),
    } as OptionMap,
    menu: [] as Menu,
  }),
  getters: {
    keys(): OptionsKeys {
      return {
        single: ['category', 'tier', 'exotic', 'rarity', 'useable_by', 'family', 'spell_type', 'item_type', 'place'],
        array: ['event', 'tags'],
        status: ['causes', 'cures', 'gives', 'immunities'],
      }
    }
  },
  actions: {
    init() {
      const codex = useCodexState();
      this.$reset();
      this.initMenu();
      Object.values(codex.used).forEach((items) => {
        Object.values(items).forEach((item) => {
          this.update(item);
        })
      })
    },
    update(item: CodexItem) {
      this.keys.single.forEach((key) => {
        this.add(item, key);
      })

      this.keys.array.forEach((key) => {
        this.add(item, key);
      })

      this.keys.status.forEach((key) => {
        if (item[key] !== undefined) {
          (item[key] as Array<Status>).forEach((status) => {
            this.options[key].add(status.name);
          })
        }
      })
    },
    add(item: CodexItem, key: string) {
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
    initMenu() {
      this.menu = Object.keys(this.options).slice(1).map((key) => [key, true]);
    }
  }
})

export interface Filter {
  key: string,
  value: Array<string> | string | number | undefined,
}
export type Filters = Array<Filter>;
export interface FiltersMap {
  search: string,
  filters: Filters,
  sort: string | undefined,
  asc: boolean,
}

export const useFiltersState = defineStore('filters', {
  state: () => ({
    search: '' as string,
    filters: [{
      key: 'category',
      value: undefined,
    }] as Filters,
    sort: undefined as string | undefined,
    asc: false,
  }),
  getters: {
    precentKeysSet(): Set<string> {
      return new Set(['ward', 'crit', 'gold_bonus',
        'follower_stats', 'luck_bonus', 'view_distance', 'summon_stats',
        'follower_act', 'exp_bonus', 'orn_bonus', 'monster_attraction'])
    },
    sortKeys(): Array<string> {
      return ['attack', 'magic', 'defense', 'resistance', 'dexterity', 'crit',
        'hp', 'mana', 'ward', 'foresight', 'orn_bonus', 'exp_bonus', 'luck_bonus', 'gold_bonus',
        'follower_stats', 'follower_act', 'summon_stats',
        'view_distance', 'adornment_slots', 'monster_attraction',]
    },
  },
  actions: {
    patch(filtersMap: FiltersMap) {
      const { options } = storeToRefs(useOptionsState());
      if (filtersMap.sort !== undefined
        && !(['name', 'tier']).includes(filtersMap.sort)
        && !this.sortKeys.includes(filtersMap.sort)
      ) {
        filtersMap.sort = undefined;
      }
      const filters = filtersMap.filters.filter(({ key: key }) => key in options.value);
      filters.forEach(({ key: key, value: value }, index) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            const verified = value.filter((v) => options.value[key].has(v));
            if (value.length !== verified.length) {
              filters[index].value = verified;
            }
          }
        } else {
          if (value !== undefined && !options.value[key].has(value)) {
            filters[index].value = undefined;
          }
        }
      })
      filtersMap.filters = filters;
      this.$patch(filtersMap);
    },
    encode() {
      return btoa(encodeURIComponent(JSON.stringify(this.$state)))
    },
    decode(base64: string) {
      return JSON.parse(decodeURIComponent(atob(base64)))
    },
    reset() {
      const optionsState = useOptionsState();
      optionsState.initMenu();
      this.$reset();
    },
    isPercentSortKey() {
      return this.precentKeysSet.has(this.$state.sort as string)
    },
    add(key: string) {
      const optionsState = useOptionsState()
      this.filters.push({
        key: key,
        value: optionsState.keys.status.includes(key) ? [] : undefined,
      })
    }
  }
})

export const useItemListState = defineStore('item-list', {
  state: () => ({
    items: [] as CodexIndex,
    index: 0,
    loading: false,
    finished: false,
    render: useDebounceFn(() => {
      const list = useItemListState();
      list.clear();
      list.load();
    }, 500, { maxWait: 1000 }),
  }),
  actions: {
    clear() {
      this.items = [];
      this.index = 0;
      this.finished = false;
      this.loading = false;
    },
    load() {
      this.loading = true;
      const { sorted } = storeToRefs(useCodexState());
      const sortedCodex = sorted.value;
      const codexLength = sortedCodex.length;
      const chunkSize = 40;
      const minChunkSize = Math.min(chunkSize, codexLength - this.index);
      for (let i = 0; i < minChunkSize; i++) {
        this.items.push(sortedCodex[this.index + i]);
      }
      this.index += minChunkSize;
      this.loading = false;
      if (this.index >= codexLength) {
        this.finished = true;
      }
    },
  }
})

interface GuideMap {
  [key: string]: string,
}

export interface GuideCache {
  [key: string]: any,
}

const statKeys = ['hp', 'mana', 'attack', 'magic', 'defense',
  'resistance', 'dexterity', 'ward', 'crit', 'foresight'];

export type GuideStats = Stats;

export const useGuideState = defineStore('guide', {
  state: () => ({
    apiMap: {
      'items': 'item',
      'monsters': 'monster',
      'bosses': 'monster',
      'raids': 'monster',
      'followers': 'pet',
      'spells': 'skill',
    } as GuideMap,
    pageMap: {
      'items': 'items',
      'monsters': 'monsters',
      'bosses': 'monsters',
      'raids': 'monsters',
      'followers': 'pets',
      'spells': 'skills',
    } as GuideMap,
    cache: undefined as GuideCache | undefined,
  }),
  getters: {
    page(state) {
      const codexViewState = useCodexViewState();
      return {
        category: state.pageMap[codexViewState.page.category],
        id: state.cache !== undefined ? state.cache.id : '',
      } as CodexView
    },
    stats(state) {
      if (state.cache === undefined) {
        return undefined;
      }
      return state.cache.stats as GuideStats;
    }
  },
  actions: {
    isMonster() {
      const codexViewState = useCodexViewState();
      return ['monsters', 'bosses', 'raids'].includes(codexViewState.page.category);
    },
    async searchByCodexName() {
      const codexViewState = useCodexViewState();
      let itemName = codexViewState.item['name'];
      if (this.apiMap[codexViewState.page.category as string] === undefined) {
        return [];
      }
      if (this.isMonster() && itemName.endsWith(' (Arisen)')) {
        itemName = itemName.slice(0, -9);
      }
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000);
      try {
        const resp = await fetch(`${global.guideApiUrl}/${this.apiMap[codexViewState.page.category as string]}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({ "icontains": [{ "name": itemName }] })
        })
        const result = await resp.json();
        return result;
      } catch (error) {
        return [];
      }
    },
    async refreshCache() {
      const codexViewState = useCodexViewState();
      if (this.cache === undefined) {
        const result = await this.searchByCodexName();
        for (const c of result) {
          if (c['codex'] === codexViewState.url) {
            this.cache = c;
            break
          }
        }
      }
      return this.cache !== undefined;
    },
  }
})

export const useAssessState = defineStore('assess', {
  state: () => ({
    query: <AssessQuery>{
      data: {},
      extra: {},
    },
    result: {
      quality: 1,
      stats: <GuideStats>{},
    },
  }),
  actions: {
    async queryGuideApi() {
      try {
        const resp = await fetch(`${global.guideApiUrl}/assess`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(this.query.data).map(([k, v]) => [k, Number(v)])
            )
          )
        })
        this.result = await resp.json();
        return true;
      } catch (error) {
        return false;
      }
    },
    initGuideQuery() {
      const guideState = useGuideState();
      if (guideState.stats !== undefined) {
        this.query.data = {
          id: (guideState.cache as GuideCache).id,
          level: 1,
        }
        this.query.extra = {
          isQuality: false,
          isBoss: (guideState.cache as GuideCache).boss,
          fromGuide: true,
          baseStats: guideState.stats,
        }
        for (const [key, value] of (Object.entries(guideState.stats) as Array<[string, Stat]>)) {
          this.query.data[key] = value.base;
        }
      }
    },
    initYacoQuery(quality: boolean = false) {
      const guideState = useGuideState();
      const codexViewState = useCodexViewState();
      this.query.data = {
        level: 1,
      };
      this.query.extra = {
        isQuality: quality,
        isCelestial: codexViewState.isCelestial,
        isWeapon: codexViewState.isWeapon,
        isBoss: !codexViewState.isCelestialWeapon,
        isMoreSlots: codexViewState.isMoreSlots,
        isUpgradable: codexViewState.isUpgradable,
        baseStats: {} as GuideStats,
      };
      if (quality) {
        this.query.data.quality = 100;
        if (guideState.cache !== undefined) {
          this.query.extra.fromGuide = true;
          this.query.extra.isBoss = guideState.cache.boss;
        }
      }
      for (const [key, value] of (Object.entries(codexViewState.item.stats) as Array<[string, string]>)) {
        if (statKeys.includes(key)) {
          this.query.data[key] = Number(value.endsWith('%') ? value.slice(0, -1) : value);
          this.query.extra.baseStats[key] = { base: this.query.data[key], values: [] };
        }
      }
    },
    queryYacoApi() {
      this.result = assess(this.query);
    }
  }
})

export interface ComparedItem {
  id: string,
  quality: string,
  level: number,
  isBoss: boolean,
}

const COMPARE_ITEMS_MAX = 4;

export const useCompareState = defineStore('compare', {
  state: () => ({
    list: Array<ComparedItem>(),
  }),
  getters: {
    keys(state) {
      const keysSet = new Set();
      const codexState = useCodexState();
      state.list.forEach((comparedItem) => {
        const item = codexState.used['items'][comparedItem.id];
        Object.keys(item['stats'] || {}).forEach((key) => {
          keysSet.add(key);
        })
        if (isMoreSlotsItem(item)) {
          keysSet.add('adornment_slots');
        }
      });
      const filtersState = useFiltersState();
      return filtersState.sortKeys.filter((key) => { return keysSet.has(key) })
    },
    assess(state) {
      const codexState = useCodexState();
      return state.list.map((item) => {
        const usedItem = codexState.used['items'][item.id];
        const query: AssessQuery = {
          data: {
            quality: Number(item.quality),
          },
          extra: {
            isQuality: true,
            isCelestial: false,
            isWeapon: usedItem['item_type'] === 'weapon',
            isBoss: item.isBoss,
            isMoreSlots: isMoreSlotsItem(usedItem),
            baseStats: {} as GuideStats,
          }
        };
        for (const [key, value] of (Object.entries(usedItem.stats) as Array<[string, string]>)) {
          if (statKeys.includes(key)) {
            query.data[key] = Number(value.endsWith('%') ? value.slice(0, -1) : value);
            query.extra.baseStats[key] = { base: query.data[key], values: [] };
          }
        }
        return assess(query);
      })
    },
  },
  actions: {
    addItem(item: ComparedItem) {
      if (this.list.length < COMPARE_ITEMS_MAX) {
        this.list.push(item);
        return true
      } else {
        return false
      }
    },
    removeItem(index: number) {
      this.list.splice(index, 1);
    },
    leftShiftItem(index: number) {
      [this.list[index - 1], this.list[index]] = [this.list[index], this.list[index - 1]];
    },
    checkMoreSlots(item: CodexItem) {
      return item['item_type'] === 'weapon' || (item['item_type'] === 'armor' && item['place'] !== 'accessory' && item['place'] !== 'off-hand');
    }
  }
})