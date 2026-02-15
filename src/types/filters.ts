import config from "@/config";

export type FilterOperator = keyof typeof config.operators;

export interface Filter {
  value: Array<string> | Array<number>;
  operator: FilterOperator;
}

export type Filters = Map<string, Filter>;

export interface FiltersState {
  filters: Array<[string, Filter]>;
  options: FilterOptions;
  search: string | null;
}

export interface FilterOptions {
  searchNameOnly: boolean;
  eventDrops: boolean;
}

export type SearchGroup = Map<string | number, Set<string>>;
