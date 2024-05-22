import { createI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { Locale as ComponentsLocale } from '@varlet/ui'

import messages from './locale.json'

ComponentsLocale.add('zh-hans', ComponentsLocale.zhCN)
ComponentsLocale.add('zh-hant', ComponentsLocale.zhTW)
ComponentsLocale.add('en', ComponentsLocale.enUS)

export type Locale = 'zh-hans' | 'zh-hant' | 'en'

const browserLocale: string = navigator.language

const LANGS: Record<string, Locale> = {
  'zh-CN': 'zh-hans',
  'zh-TW': 'zh-hant',
  'zh-HK': 'zh-hant',
  'en-US': 'en'
}

const fallbackLocale: Locale = 'en'

const currentLocale = useLocalStorage(
  'locale',
  browserLocale in LANGS ? LANGS[browserLocale] : fallbackLocale
)

// fix store locale error
if (!(Object.values(LANGS) as Array<string>).includes(currentLocale.value)) {
  currentLocale.value = fallbackLocale
}

ComponentsLocale.use(currentLocale.value)

export const i18n = createI18n<false>({
  legacy: false,
  locale: currentLocale.value,
  fallbackLocale: fallbackLocale,
  messages: messages
})

export function setLocale(locale: Locale) {
  currentLocale.value = locale
  i18n.global.locale.value = currentLocale.value
  ComponentsLocale.use(currentLocale.value)
}
