import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const ornaUrl = 'https://playorna.com';
const ornaStaticUrl = `${ornaUrl}/static`;

// https://vitejs.dev/config/
export default defineConfig({
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
          '@vueuse/core': [
            'useStorage',
            'useDebounceFn',
          ]
        },
      ],
      eslintrc: { enabled: true },
      resolvers: [VarletImportResolver({ autoImport: true })]
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locale.json'),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    '__ORNA_URL__': JSON.stringify(ornaUrl),
    '__ORNA_STATIC_URL__': JSON.stringify(ornaStaticUrl),
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@staticUrl: '${ornaStaticUrl}';`,
      },
    },
  },
})
