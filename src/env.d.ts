/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'production' | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
