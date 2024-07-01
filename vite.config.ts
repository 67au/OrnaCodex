import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ornaUrl = env.ORNA_URL || 'https://playorna.com'
  const dataCreated = env.DATA_CREATED || Math.floor(new Date().getTime() / 1000)
  const extraApiUrl = env.EXTRA_API_URL || ''
  const ornaStaticUrl = `${ornaUrl}/static`
  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Yet Another Codex for Orna',
          short_name: 'Codex YACO',
          description: 'Yet Another Codex for Orna',
          theme_color: '#ffffff',
          icons: [192, 256, 384, 512].map((x) => ({
            src: '/favicon.svg',
            sizes: `${x}x${x}`,
            type: 'image/svg+xml',
            purpose: 'any'
          }))
        },
        workbox: {
          navigateFallbackDenylist: [
            // cloudflare cdn trace
            /^\/cdn-cgi\/trace/
          ],
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${ornaStaticUrl}/`),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-images-cache',
                expiration: {
                  maxEntries: 10000,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // <== 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      }),
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
      __DATA_CREATED__: JSON.stringify(dataCreated),
      __EXTRA_API_URL__: JSON.stringify(extraApiUrl),
      __FILTERS_VERSION__: JSON.stringify('v0.1.1')
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
