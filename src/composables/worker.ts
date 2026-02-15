import { useCodexState } from '@/stores/codex'
import QueryWorker from '@/worker?worker'
import type { Message, Payload, QueryIndexPost } from '@/types/worker'
import { useFiltersState } from '@/stores/filters'
import { cloneDeep } from 'es-toolkit'
import { useSortState } from '@/stores/sort'

export function useQueryWorker() {
  const worker = useWebWorker(new QueryWorker())

  function setI18n() {
    const codexState = useCodexState()
    const payload: Payload<'setup'> = {
      type: 'i18n',
      data: Array.from(codexState.translations),
    }
    const action: Message<'setup'> = {
      type: 'setup',
      payload: payload,
    }
    worker.post(action)
  }

  function setQueryIndex(queryIndex: QueryIndexPost) {
    const payload: Payload<'setup'> = {
      type: 'index',
      data: queryIndex,
    }
    const action: Message<'setup'> = {
      type: 'setup',
      payload: payload,
    }
    worker.post(action)
  }

  const debouncePost = useDebounceFn((action) => worker.post(action), 1000)
  function handleQuery() {
    const filtersState = useFiltersState()
    const sortState = useSortState()
    const payload: Payload<'query'> = {
      filters: cloneDeep(filtersState.state),
      sorts: cloneDeep(sortState.$state),
    }
    const action: Message<'query'> = {
      type: 'query',
      payload: payload,
    }
    debouncePost(action)
  }

  return { worker, setI18n, setQueryIndex, handleQuery }
}
