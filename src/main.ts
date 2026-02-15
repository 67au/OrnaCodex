import '@/styles/main.scss'
import 'vuetify/styles/core'
import 'vuetify/styles/colors'
import 'vuetify/styles/utilities'

import { createApp } from 'vue'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { piniaPlugin } from '@/stores'

import App from './App.vue'
import router from '@/router'
import { i18n, vuetifyLocale } from '@/i18n'
import { themes } from '@/styles/themes'
import { defaultTheme } from '@/styles'
import { md3 } from 'vuetify/blueprints'

const app = createApp(App)
const vuetify = createVuetify({
  locale: vuetifyLocale,
  defaults: {
    global: {
      density: 'comfortable',
    },
    VAvatar: {
      color: 'transparent',
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

app.use(piniaPlugin)
app.use(router)
app.use(i18n)

app.mount('#app')
