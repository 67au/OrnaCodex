import { useWebWorker } from '@vueuse/core'
import CodexWorker from '@/plugins/worker?worker'
import { useCodexState } from './codex'
import type { Command } from '@/types/worker'
import { useSortState } from './sort'
import { useFiltersState } from './filters'
import config from '@/config'

export const useWorkerState = defineStore('worker', () => {
  const codexState = useCodexState()
  const sortState = useSortState()
  const filtersState = useFiltersState()

  const worker = useWebWorker(new CodexWorker())

  function setInit() {
    const payload = Object.fromEntries(
      Object.entries(codexState.codex!).flatMap(([key, value]) =>
        Object.entries(value).map(([k, v]) => [`${key}/${k}`, v]),
      ),
    )
    worker.post({
      type: 'INIT',
      payload: payload,
    } as Command<'INIT'>)
    return Object.keys(payload)
  }

  function setI18n() {
    worker.post({
      type: 'I18N',
      payload: Object.fromEntries(
        Object.entries(codexState.translation.main!).flatMap(([key, value]) => {
          return Object.entries(value).map(([k, v]) => [`${key}/${k}`, v])
        }),
      ),
    } as Command<'I18N'>)
  }

  function setFilter() {
    const { filters, options, search } = filtersState
    worker.post({
      type: 'FILTER',
      payload: {
        filters: JSON.parse(JSON.stringify(filters)),
        options: JSON.parse(JSON.stringify(options)),
        search: search || '',
      },
    } as Command<'FILTER'>)
  }

  function setSort() {
    const { category, key, asc, primary } = sortState
    worker.post({
      type: 'SORT',
      payload: {
        category: category,
        key: key,
        asc: asc,
        primary: config.primarySort[primary],
      },
    } as Command<'SORT'>)
  }

  return {
    worker,
    setInit,
    setI18n,
    setFilter,
    setSort,
  }
})
