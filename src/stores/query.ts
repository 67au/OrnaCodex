import { useBuildQueryIndex } from "@/composables/queryIndex";
import { useQueryWorker } from "@/composables/worker";
import { isNull } from "es-toolkit";

export const useQueryState = defineStore("query", () => {
  const queryWorker = useQueryWorker();
  const worker = queryWorker.worker;

  async function initialize() {
    const queryIndex = useBuildQueryIndex();
    const index = await queryIndex.buildIndex();
    if (isNull(index)) {
      return false;
    }
    queryWorker.setQueryIndex(index);
    queryWorker.setI18n();
    return true;
  }

  async function purgeCache() {
    const queryIndex = useBuildQueryIndex();
    await queryIndex.clear();
  }

  return { queryWorker, worker, initialize, purgeCache };
});
