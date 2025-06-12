# Quit Toxic

A habit quit tracker built with React, TypeScript, and Vite. This is the Vite version of the original Next.js Quit Toxic application.

## Features

- Track multiple quit habits with precise timers
- Beautiful color mood system with themes
- Responsive design with mobile support
- Local storage persistence
- Export/import preferences
- Real-time countdown timers
- Analytics and statistics

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Date Handling**: date-fns, dayjs
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── app/             # Main app components
│   ├── providers/       # Context providers
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── store/               # Zustand store
└── App.tsx              # Main app component
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Migration from Next.js

This project was converted from a Next.js application to Vite with the following changes:

1. Removed Next.js specific features (`next-themes`, `use client` directives)
2. Implemented custom theme provider
3. Updated import paths and configuration
4. Adapted routing to single-page application
5. Updated build configuration for Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Environment Variables

This application uses environment variables for configuration. Copy `.env.example` to `.env` and modify the values as needed.

### Configuration Files

- `.env` - Default environment variables for all environments
- `.env.local` - Local overrides (not committed to git)
- `.env.example` - Template showing all available variables

### Available Variables

#### Application Info

- `VITE_APP_NAME` - Application name (default: "Quit Toxic")
- `VITE_APP_VERSION` - Application version (default: "0.1.0")

#### Storage Configuration

- `VITE_MOOD_STORAGE_KEY` - LocalStorage key for mood preferences
- `VITE_MOOD_SETTINGS_KEY` - LocalStorage key for mood settings
- `VITE_MOOD_ANALYTICS_KEY` - LocalStorage key for mood analytics
- `VITE_THEME_STORAGE_KEY` - LocalStorage key for theme preferences
- `VITE_ZUSTAND_STORAGE_NAME` - Zustand persistence storage name

#### Mood System

- `VITE_AUTO_MOOD_CHECK_INTERVAL` - Auto mood detection interval in milliseconds (default: 3600000 = 1 hour)
- `VITE_DEFAULT_MOOD` - Default mood theme (calm, energetic, focused, cheerful, dark)
- `VITE_DEFAULT_THEME` - Default theme (light, dark, system)

#### Feature Flags

- `VITE_ENABLE_MOOD_AUTO_DETECTION` - Enable automatic mood detection (default: false)
- `VITE_ENABLE_REMEMBER_LAST_MOOD` - Remember last selected mood (default: true)
- `VITE_ENABLE_ANALYTICS` - Enable mood usage analytics (default: true)

#### Export/Import

- `VITE_EXPORT_FILE_PREFIX` - Prefix for exported preference files
- `VITE_EXPORT_DATE_FORMAT` - Date format for export filenames

### Setup Instructions

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Modify `.env` with your preferred settings

3. For local development overrides, create `.env.local`:

```bash
cp .env.local.example .env.local
```
