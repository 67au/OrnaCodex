import config from "@/config";
import type { FilterOperator, FilterOptions, Filters, FiltersState } from "@/types/filters";
import { isUndefined, mapValues } from "es-toolkit";

const defaultOptions: Readonly<FilterOptions> = {
  eventDrops: false,
  searchNameOnly: false,
};

const firstOp = Object.keys(config.operators)[0]! as FilterOperator;

export const useFiltersState = defineStore(
  "filters",
  () => {
    const filters: Ref<Filters> = ref(new Map());
    const search: Ref<string | null> = ref(null);
    const options: Ref<FilterOptions> = ref({ ...defaultOptions });

    const activeOptions = computed(() => {
      return Object.keys(defaultOptions).filter(
        (k) => options.value[k as keyof FilterOptions],
      ) as Array<keyof FilterOptions>;
    });
    const defaultOptionsKey = Object.keys(defaultOptions) as Array<keyof FilterOptions>;
    const keys = computed(() => {
      return Array.from(filters.value.keys());
    });

    const state: ComputedRef<FiltersState> = computed(() => {
      return {
        filters: Array.from(filters.value),
        options: options.value,
        search: search.value,
      };
    });

    function $reset() {
      filters.value.clear();
      search.value = null;
    }

    function setFilter(key: string) {
      if (isUndefined(filters.value.get(key))) {
        filters.value.set(key, {
          value: [],
          operator: firstOp,
        });
      } else {
        filters.value.delete(key);
      }
    }

    return {
      filters,
      search,
      keys,
      options,
      state,
      activeOptions,
      defaultOptionsKey,
      $reset,
      setFilter,
    };
  },
  {
    persistedState: {
      persist: true,
      serialize: (state) => {
        const r = mapValues(state, (value, key) => {
          if (key === "filters") {
            return Array.from(value as Filters);
          }
          return value;
        });
        return JSON.stringify(r);
      },
      deserialize: (val) => {
        const r = JSON.parse(val);
        return mapValues(r, (value, key) => {
          if (key === "filters") {
            return new Map(value);
          }
          return value;
        });
      },
    },
  },
);
