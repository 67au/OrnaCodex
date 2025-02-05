import { createApp } from 'vue'
import '@varlet/touch-emulator'

import router from '@/router'
import { i18n } from '@/i18n'
import { plugin as stores } from '@/stores'
import App from './App.vue'

import '@/styles/common.less'
import '@/styles/color.less'
import 'virtual:uno.css'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.mount('#app')
