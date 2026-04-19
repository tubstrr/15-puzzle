# src/

Application source code for the 15 Puzzle project.

## Structure

```
src/
├── nuxt/       ← Nuxt 3 PWA (web app)
└── ionic/      ← Ionic/Capacitor (mobile app)
```

## nuxt/

The primary web application — a Nuxt 3 PWA that runs in any browser and is installable as a standalone app.

- Framework: Nuxt 3 + Vue 3
- Styling: Tailwind CSS + shadcn-vue
- PWA: `@vite-pwa/nuxt` with offline support
- Package manager: pnpm

**Dev:** `make dev` (from repo root) → `http://localhost:3000`

## ionic/

The mobile app wrapper using Ionic Framework and Capacitor. Shares the same puzzle logic but packages it as a native Android and iOS app.

- Framework: Ionic 8 + Vue 3 + Vite
- Native: Capacitor 7 (Android + iOS)
- Package manager: npm

**Dev:** `make ionic-dev` (from repo root) → `http://localhost:5173`
