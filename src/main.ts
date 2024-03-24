import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@varlet/touch-emulator'

import router from '@/router'
import { i18n} from '@/i18n'
import App from './App.vue'

import '@/styles/main.less'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')