/**
 * Environment Configuration
 * Centralized access to environment variables with type safety and defaults
 */

// Application configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "Quit Toxic",
  version: import.meta.env.VITE_APP_VERSION || "0.1.0",
} as const;

// Local storage keys configuration
export const STORAGE_KEYS = {
  mood: import.meta.env.VITE_MOOD_STORAGE_KEY || "Quit-Toxic-color-mood",
  moodSettings:
    import.meta.env.VITE_MOOD_SETTINGS_KEY || "Quit-Toxic-mood-settings",
  moodAnalytics:
    import.meta.env.VITE_MOOD_ANALYTICS_KEY || "Quit-Toxic-mood-analytics",
  theme: import.meta.env.VITE_THEME_STORAGE_KEY || "theme",
  zustandStorage:
    import.meta.env.VITE_ZUSTAND_STORAGE_NAME || "quit-toxic-storage",
} as const;

// Mood system configuration
export const MOOD_CONFIG = {
  autoCheckInterval:
    Number(import.meta.env.VITE_AUTO_MOOD_CHECK_INTERVAL) || 3600000, // 1 hour
  defaultMood: import.meta.env.VITE_DEFAULT_MOOD || "calm",
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME || "system",
} as const;

// Feature flags
export const FEATURES = {
  enableMoodAutoDetection:
    import.meta.env.VITE_ENABLE_MOOD_AUTO_DETECTION === "true",
  enableRememberLastMood:
    import.meta.env.VITE_ENABLE_REMEMBER_LAST_MOOD !== "false", // default true
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== "false", // default true
} as const;

// Export/Import configuration
export const EXPORT_CONFIG = {
  filePrefix:
    import.meta.env.VITE_EXPORT_FILE_PREFIX || "Quit-Toxic-mood-preferences",
  dateFormat: import.meta.env.VITE_EXPORT_DATE_FORMAT || "YYYY-MM-DD",
} as const;

// Type definitions for TypeScript support
export type AppConfig = typeof APP_CONFIG;
export type StorageKeys = typeof STORAGE_KEYS;
export type MoodConfig = typeof MOOD_CONFIG;
export type Features = typeof FEATURES;
export type ExportConfig = typeof EXPORT_CONFIG;

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = [
    "VITE_APP_NAME",
    "VITE_MOOD_STORAGE_KEY",
    "VITE_MOOD_SETTINGS_KEY",
    "VITE_MOOD_ANALYTICS_KEY",
  ];

  const missing = requiredVars.filter((varName) => !import.meta.env[varName]);

  if (missing.length > 0 && import.meta.env.NODE_ENV === "production") {
    console.warn("Missing environment variables:", missing.join(", "));
    console.warn("Using default values. Consider setting these in .env file.");
  }
};

// Run validation
validateEnv();

// Export all configurations as a single object for convenience
export const CONFIG = {
  app: APP_CONFIG,
  storage: STORAGE_KEYS,
  mood: MOOD_CONFIG,
  features: FEATURES,
  export: EXPORT_CONFIG,
} as const;

export default CONFIG;
