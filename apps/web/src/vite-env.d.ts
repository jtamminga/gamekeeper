/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STATIC_DATA: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}