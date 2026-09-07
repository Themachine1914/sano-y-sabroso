/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FACILAPP_WHATSAPP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
