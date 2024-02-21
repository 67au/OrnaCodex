import { createI18n } from 'vue-i18n'
import { Locale } from '@varlet/ui'

import {store} from '@/store'

import messages from './locale.json'

const browserLocale = navigator.language || navigator.userLanguage

const langs = {
    'zh-CN': 'zh-hans',
    'zh-TW': 'zh-hant',
    'zh-HK': 'zh-hant',
    'en-US': 'en',
}

const lang = store.state.language || langs[browserLocale]===undefined || 'en';

store.state.language = lang

Locale.add('zh-hans', Locale.zhCN)
Locale.add('zh-hant', Locale.zhTW)
Locale.add('en', Locale.enUS)

export const i18n = createI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages: messages,
})

export function setLocale(locale) {
    store.state.language = locale
    i18n.global.locale = locale
}
