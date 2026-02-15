/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/vue" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_EXTRA_API_URL: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ORNA_URL: string;
  readonly VITE_ORNA_STATIC_URL: string;
  readonly VITE_EXTRA_DATA_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
