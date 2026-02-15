import type { CodexEntryKey } from "@/types/codex";
import { useQueryState } from "./query";
import { isUndefined } from "es-toolkit";
import { useSettingsStore } from "./settings";

const settings = useSettingsStore();

export const useEntriesListState = defineStore("entries_list", () => {
  const list: Ref<Array<CodexEntryKey>> = shallowRef([]);
  const index: Ref<number> = ref(0);
  const page: Ref<number> = ref(1);

  const entries: ComputedRef<Array<CodexEntryKey>> = computed(() => {
    const queryState = useQueryState();
    return queryState.worker.data ?? [];
  });
  const length = computed(() => entries.value.length);

  const loadDone = ref();
  const chunkSize = 30;

  function load({ done }: { done: CallableFunction }) {
    if (isUndefined(done)) {
      return;
    }
    if (isUndefined(loadDone.value)) {
      loadDone.value = done;
    }
    done("loading");
    const minChunkSize = Math.min(chunkSize, entries.value.length - index.value);
    entries.value.slice(index.value, index.value + minChunkSize).forEach((key) => {
      list.value.push(key);
    });
    triggerRef(list);
    index.value += chunkSize;
    done("ok");
    if (index.value >= entries.value.length) {
      done("empty");
    }
  }

  const pageEntries = computed(() => {
    return entries.value.slice((page.value - 1) * chunkSize, page.value * chunkSize);
  });
  const pageCount = computed(() => Math.ceil(length.value / chunkSize));

  function $reset() {
    list.value = [];
    index.value = 0;
    page.value = 1;
  }

  const reset = () =>
    nextTick(() => {
      $reset();
      if (settings.value.display.page) {
        //
      } else {
        load({ done: loadDone.value });
      }
    });

  return { entries, list, length, page, pageEntries, pageCount, load, $reset, reset };
});
