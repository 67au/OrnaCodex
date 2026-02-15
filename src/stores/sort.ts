import config from "@/config";
import { get } from "es-toolkit/compat";

export const useSortState = defineStore(
  "sort",
  () => {
    const category = shallowRef("");
    const key = shallowRef("");
    const asc = shallowRef(false);
    const primary: ShallowRef<keyof typeof config.primarySort> = shallowRef("default");

    const primarySort = computed(() => {
      return (
        get(config.primarySort, primary.value) ?? {
          key: undefined,
          asc: undefined,
        }
      );
    });

    const active = computed(() => key.value !== "");

    function $reset() {
      category.value = "";
      key.value = "";
      asc.value = false;
    }

    return { category, key, asc, primary, primarySort, active, $reset };
  },
  {
    persistedState: {
      persist: true,
    },
  },
);
