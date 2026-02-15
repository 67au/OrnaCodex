import type { SnackbarMessage } from 'vuetify/lib/components/VSnackbarQueue/VSnackbarQueue.mjs'

export const useMessagesState = defineStore('messages', () => {
  const queue: Ref<Array<SnackbarMessage>> = ref([])

  function add(message: SnackbarMessage) {
    queue.value.push(message)
  }

  return { queue, add }
})
