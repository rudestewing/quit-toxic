/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application Info
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // Local Storage Keys
  readonly VITE_MOOD_STORAGE_KEY: string;
  readonly VITE_MOOD_SETTINGS_KEY: string;
  readonly VITE_MOOD_ANALYTICS_KEY: string;
  readonly VITE_THEME_STORAGE_KEY: string;
  readonly VITE_ZUSTAND_STORAGE_NAME: string;

  // Mood System Configuration
  readonly VITE_AUTO_MOOD_CHECK_INTERVAL: string;
  readonly VITE_DEFAULT_MOOD: string;
  readonly VITE_DEFAULT_THEME: string;

  // Features Configuration
  readonly VITE_ENABLE_MOOD_AUTO_DETECTION: string;
  readonly VITE_ENABLE_REMEMBER_LAST_MOOD: string;
  readonly VITE_ENABLE_ANALYTICS: string;

  // Export/Import Configuration
  readonly VITE_EXPORT_FILE_PREFIX: string;
  readonly VITE_EXPORT_DATE_FORMAT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
