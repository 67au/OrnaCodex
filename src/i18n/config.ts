import { en as usEn, zhHans, zhHant } from 'vuetify/locale'

export const supportedLocales = ['en', 'zh-hans', 'zh-hant'] as const

export type Locale = (typeof supportedLocales)[number]

export const fallbackLocale: Locale = 'en'

export const BROWSER_LANG_MAP: Record<string, Locale> = {
  'zh-CN': 'zh-hans',
  'zh-SG': 'zh-hans',
  'zh-TW': 'zh-hant',
  'zh-HK': 'zh-hant',
  'zh-MO': 'zh-hant',
}

export const LANG_DISPLAY_NAME: Record<Locale, string> = {
  en: 'English',
  'zh-hans': '简体中文',
  'zh-hant': '繁体中文',
}

export const vuetifyLocaleMessages = {
  en: usEn,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
}
