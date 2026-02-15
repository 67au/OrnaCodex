import type config from "@/config";

export interface SortsState {
  category: string;
  key: string;
  asc: boolean;
  primary: keyof typeof config.primarySort;
}
