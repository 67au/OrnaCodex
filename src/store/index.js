import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

export const store = reactive({
  lang: null,
  homeTop: 0,
  state: useStorage('vueuse', {
    language: null,
    theme: null,
  })
})