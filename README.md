# 🚭 Quit Toxic

A modern, elegant habit quit tracker designed to help you break free from toxic habits and build healthier routines. Built with React, TypeScript, and Vite for optimal performance and developer experience.

## ✨ Features

- **📊 Real-time Tracking**: Live countdown timers showing your progress since quitting
- **🎨 Beautiful Color Mood System**: Dynamic themes that adapt to your mood and progress
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **💾 Local Storage Persistence**: Your data stays with you, no account required
- **📈 Analytics & Statistics**: Visualize your progress with detailed insights
- **🔄 Export/Import**: Backup and restore your preferences easily
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🌙 Dark/Light Mode**: Comfortable viewing in any lighting condition
- **♿ Accessibility**: Built with proper ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/quit-toxic.git
   cd quit-toxic
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### 🏗️ Build Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory to customize the application:

```bash
# Application Info
VITE_APP_NAME="Quit Toxic"
VITE_APP_VERSION="0.1.0"

# Storage Configuration
VITE_MOOD_STORAGE_KEY="quit-toxic-mood"
VITE_MOOD_SETTINGS_KEY="quit-toxic-mood-settings"
VITE_MOOD_ANALYTICS_KEY="quit-toxic-mood-analytics"
VITE_THEME_STORAGE_KEY="quit-toxic-theme"
VITE_ZUSTAND_STORAGE_NAME="quit-toxic-store"

# Mood System
VITE_AUTO_MOOD_CHECK_INTERVAL=3600000  # 1 hour
VITE_DEFAULT_MOOD="calm"               # calm, energetic, focused, cheerful, dark
VITE_DEFAULT_THEME="system"            # light, dark, system

# Feature Flags
VITE_ENABLE_MOOD_AUTO_DETECTION=false
VITE_ENABLE_REMEMBER_LAST_MOOD=true
VITE_ENABLE_ANALYTICS=true

# Export/Import
VITE_EXPORT_FILE_PREFIX="quit-toxic-backup"
VITE_EXPORT_DATE_FORMAT="yyyy-MM-dd"
```

### Available Themes

The application supports several color mood themes:

- **🌊 Calm**: Soothing blues and greens for relaxation
- **⚡ Energetic**: Vibrant oranges and reds for motivation
- **🎯 Focused**: Clean grays and blues for concentration
- **☀️ Cheerful**: Bright yellows and warm tones for positivity
- **🌙 Dark**: Dark theme with high contrast

## 🎨 Customization

### Adding New Themes

1. Define colors in `src/lib/colors.ts`
2. Add theme logic to `src/lib/color-mood-utils.ts`
3. Update the theme selector in `src/components/color-mood-selector.tsx`

### Modifying UI Components

All UI components are built with Radix UI and styled with Tailwind CSS. You can customize:

- **Colors**: Update `tailwind.config.js` CSS variables
- **Spacing**: Modify Tailwind spacing classes
- **Animations**: Customize in `tailwind.config.js` animations section

## 🔄 Migration from Next.js

This project was successfully migrated from Next.js to Vite with the following improvements:

### Key Changes

- ✅ **Faster Development**: Vite's HMR is significantly faster than Next.js
- ✅ **Simpler Configuration**: Less configuration overhead
- ✅ **Better TypeScript Support**: Enhanced type checking and IntelliSense
- ✅ **Custom Theme Provider**: Replaced `next-themes` with custom implementation
- ✅ **Optimized Build**: Smaller bundle size and faster builds
- ✅ **Updated Dependencies**: Latest versions of all packages

### Removed Dependencies

- `next` - Replaced with Vite
- `next-themes` - Custom theme provider implementation

### Migration Benefits

1. **Performance**: ~3x faster development server startup
2. **Bundle Size**: ~20% smaller production build
3. **Flexibility**: No framework restrictions on component structure
4. **Modern Tooling**: Latest Vite 6.x with enhanced features

For detailed migration steps, see [`MIGRATION_SUMMARY.md`](./MIGRATION_SUMMARY.md).

## 🧩 Vite Configuration

Currently using the official [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) plugin with Babel for Fast Refresh.

Alternative: [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses SWC for even faster refresh (experimental).

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:

```typescript
// Import from anywhere in the project
import { Button } from "@/components/ui/button";
import { useQuitStore } from "@/store/useQuitStore";
```

### Tracking Progress

- View real-time countdown timers showing days, hours, minutes, and seconds
- See visual progress with color-coded mood themes
- Access detailed analytics and statistics
- Export your data for backup or sharing

### Customizing Experience

- Switch between light/dark themes
- Choose from 5 different color mood themes
- Customize notification preferences
- Set up automatic mood detection (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Code Style**: Follow the existing ESLint configuration
2. **Components**: Use TypeScript with proper type definitions
3. **Styling**: Use Tailwind CSS classes and CSS variables
4. **State**: Use Zustand for global state management
5. **Testing**: Add tests for new features (when test setup is added)

### Getting Started with Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Reporting Issues

Please use the GitHub issue tracker to report bugs or request features. When reporting bugs, include:

- Operating system and version
- Browser and version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[Radix UI](https://radix-ui.com/)** for accessible UI primitives
- **[Tailwind CSS](https://tailwindcss.com/)** for utility-first styling
- **[Vite](https://vitejs.dev/)** for blazing fast development experience
- **[Zustand](https://zustand.docs.pmnd.rs/)** for simple state management
- **[Lucide](https://lucide.dev/)** for beautiful icons
- **[React Hook Form](https://react-hook-form.com/)** for performant forms
- **[Zod](https://zod.dev/)** for TypeScript-first schema validation

## 🔗 Links

- **Demo**: [Live Application](https://quit-toxic.vercel.app) _(replace with actual URL)_
- **Repository**: [GitHub](https://github.com/yourusername/quit-toxic) _(replace with actual URL)_
- **Issues**: [Bug Reports & Feature Requests](https://github.com/yourusername/quit-toxic/issues) _(replace with actual URL)_
- **Discussions**: [Community Forum](https://github.com/yourusername/quit-toxic/discussions) _(replace with actual URL)_

---

**Built with ❤️ by [Rudi Setiawan](https://github.com/yourusername)** | Made in Indonesia 🇮🇩

> _"Every moment you resist a toxic habit is a victory. This app is here to celebrate those victories with you."_
