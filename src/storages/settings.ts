import { useStorage } from '@vueuse/core'

const defaultSettings = {
  language: '',
  theme: '',
  displayStats: true,
  displayCard: true,
  displayMaterial: false,
  displayInGameQuality: true,
  enemyEditor: false,
}

export const settingsStorage = useStorage('settings', defaultSettings)

export function useResetSettings() {
  settingsStorage.value = defaultSettings
}
