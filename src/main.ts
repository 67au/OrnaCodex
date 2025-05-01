import '@/styles/main.scss'
import 'vuetify/styles'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'
import router from '@/router'
import { i18n, vuetifyLocale } from '@/i18n'
import { themes } from '@/styles/themes'
import { defaultTheme } from '@/styles'
import { md3 } from 'vuetify/blueprints'
import { persistedStatePlugin } from '@/stores'

const app = createApp(App)
const vuetify = createVuetify({
  locale: vuetifyLocale,
  defaults: {
    global: {
      density: 'comfortable',
    },
  },
  blueprint: md3,
  theme: {
    defaultTheme: defaultTheme,
    themes: themes,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

app.use(vuetify)

const pinia = createPinia()

pinia.use(persistedStatePlugin)
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
