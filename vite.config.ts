import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import autoImport from 'unplugin-auto-import/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify from 'vite-plugin-vuetify'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE')
  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: {
          configFile: './src/styles/settings.scss',
        },
      }),
      vueDevTools(),
      autoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            '@vueuse/core': [
              'useStorage',
              'useDebounceFn',
              'useAsyncState',
              'useClipboard',
              'createFetch',
            ],
          },
        ],
      }),
      VueI18nPlugin({
        include: [path.resolve(__dirname, './src/i18n/messages/**')],
      }),
      VitePWA({
        registerType: 'prompt',
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'Yet Another Codex for Orna',
          short_name: 'Codex YACO',
          description: 'Yet Another Codex for Orna',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 4000000,
          navigateFallbackDenylist: [
            // cloudflare cdn trace
            /^\/cdn-cgi\/trace/,
          ],
          runtimeCaching: [
            {
              urlPattern: new RegExp(`\^${env.VITE_ORNA_STATIC_URL}/\.\+`),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-images-cache',
                expiration: {
                  maxEntries: 10000,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$static-url-prefix: "${env.VITE_ORNA_STATIC_URL}";`,
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // Mock Api
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
