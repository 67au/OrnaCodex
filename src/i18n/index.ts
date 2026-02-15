import { createI18n, type I18nOptions } from 'vue-i18n'

import messages from '@intlify/unplugin-vue-i18n/messages'

import { useLocaleSettingsStore } from '@/stores/settings'
import {
  BROWSER_LANG_MAP,
  fallbackLocale,
  LANG_DISPLAY_NAME,
  supportedLocales,
  vuetifyLocaleMessages,
  type Locale,
} from './config'

const localeSettings = useLocaleSettingsStore()

function isSupportedLanguage(locale: string) {
  return (supportedLocales as readonly string[]).includes(locale)
}

function getLocale() {
  const locale = localeSettings.value.locale
  if (isSupportedLanguage(locale)) {
    return locale as Locale
  } else {
    const browserLocale = BROWSER_LANG_MAP[navigator.language]
    return browserLocale ?? fallbackLocale
  }
}

const locale = getLocale()

function getLocales(): Array<Locale> {
  const localeSet = new Set(localeSettings.value.locales)
  const locales = supportedLocales.filter((lang) => localeSet.has(lang))
  if (locales.includes(locale)) {
    return locales
  } else {
    return [locale]
  }
}

export const locales = getLocales()

export const displayLocales = locales.map((lang) => {
  const name = LANG_DISPLAY_NAME[lang]
  return {
    lang: lang,
    name: name,
  }
})

const options: I18nOptions = {
  locale: locale,
  fallbackLocale: fallbackLocale,
  messages: messages,
}

export const vuetifyLocale = {
  locale: locale,
  fallback: fallbackLocale,
  messages: vuetifyLocaleMessages,
}

export const i18n = createI18n<false, typeof options>(options)

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localeSettings.value.locale = locale
}

export type { Locale }
