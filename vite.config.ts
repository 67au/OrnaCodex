import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ornaUrl = `https://${env.ORNA_URL || 'playorna.com'}`
  const ornaStaticUrl = `${ornaUrl}/static`
  return {
    plugins: [
      vue(),
      components({
        resolvers: [VarletImportResolver()]
      }),
      autoImport({
        imports: [
          'vue',
          'vue-router',
          {
            '@vueuse/core': ['useLocalStorage', 'useDebounceFn']
          }
        ],
        eslintrc: { enabled: true },
        resolvers: [VarletImportResolver({ autoImport: true })]
      }),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locale.json')
      }),
      UnoCSS()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      __ORNA_URL__: JSON.stringify(ornaUrl),
      __ORNA_STATIC_URL__: JSON.stringify(ornaStaticUrl),
      __EXTRA_API_URL__: JSON.stringify('https://items.fqegg.top')
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@staticUrl: '${ornaStaticUrl}';`
        }
      }
    }
  }
})
