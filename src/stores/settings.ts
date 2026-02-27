const defaultSettings = {
  theme: '',
  display: {
    stats: true,
    detail: true,
    page: false,
    material: false,
    status: false,
  },
  enemyEditor: false,
}

export function useSettingsStore() {
  return useStorage('settings', defaultSettings, localStorage, { mergeDefaults: true })
}

const defaultLocaleSettings = {
  // languages setting
  locale: '',
  locales: Array<string>(),
}

export function useLocaleSettingsStore() {
  return useStorage('locales', defaultLocaleSettings, localStorage, { mergeDefaults: true })
}
