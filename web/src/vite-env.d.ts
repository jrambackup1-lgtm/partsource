/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Hosted Zoro pricing scraper URL (Fly.io / Render). Falls back to localhost. */
  readonly VITE_SCRAPER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
