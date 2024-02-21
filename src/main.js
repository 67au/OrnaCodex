import { createApp } from 'vue'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import '@varlet/touch-emulator'

import router from '@/router'
import { i18n} from '@/i18n'
import App from './App.vue'


const app = createApp(App)

app.use(router)
app.use(Varlet).use(i18n).mount('#app')