import { createI18n, type I18nOptions } from 'vue-i18n'

import messages from '@intlify/unplugin-vue-i18n/messages'

import { settingsStorage } from '@/storages/settings'
import { useCodexState } from '@/stores/codex'
import { en as usEn, zhHans, zhHant } from 'vuetify/locale'

export type Locale = 'en' | 'zh-hans' | 'zh-hant'

const locales = ['en', 'zh-hans', 'zh-hant']

const languageMap: Record<string, Locale> = {
  'zh-CN': 'zh-hans',
  'zh-SG': 'zh-hans',
  'zh-TW': 'zh-hant',
  'zh-HK': 'zh-hant',
  'zh-MO': 'zh-hant',
}

export const languageName: Array<{
  lang: Locale
  name: string
}> = [
  { lang: 'en', name: 'English' },
  { lang: 'zh-hans', name: '简体中文' },
  { lang: 'zh-hant', name: '繁体中文' },
]

const language = settingsStorage.value.language

const locale = (
  locales.includes(language) ? language : (languageMap[navigator.language] ?? 'en')
) as Locale

const options: I18nOptions = {
  locale: locale,
  fallbackLocale: 'en',
  messages: messages,
}

export const vuetifyLocale = {
  locale: locale,
  fallback: 'en',
  messages: { en: usEn, 'zh-hans': zhHans, 'zh-hant': zhHant },
}

export const i18n = createI18n<false, typeof options>(options)

export async function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  settingsStorage.value.language = locale

  const codexState = useCodexState()
  await codexState.getTranslation()
}
