const sw = true;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: ["@nuxthub/core", "@nuxt/eslint", "@vite-pwa/nuxt"],
  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },

  routeRules: {
    "/": {
      cache: {
        maxAge: 60,
        staleWhileRevalidate: 60,
      },
    },
  },

  // Development
  devtools: { enabled: true },

  // PWA
  pwa: {
    strategies: "generateSW",
    srcDir: undefined,
    filename: undefined,
    registerType: "autoUpdate",
    manifest: {
      id: "tubstrr/15-puzzle",
      name: "15 Puzzle",
      short_name: "15 Puzzle",
      description: "A simple 15 puzzle game",
      theme_color: "#004643",
      launch_handler: {
        client_mode: "navigate-existing",
      },
      orientation: "portrait",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      categories: ["games"],
      dir: "ltr",
      prefer_related_applications: false,
      screenshots: [
        {
          src: "screenshot_1.png",
          sizes: "746/1338",
          type: "image/jpg",
          platform: "any",
        },
        {
          src: "screenshot_2.png",
          sizes: "746/1338",
          type: "image/jpg",
          platform: "any",
        },
        {
          src: "screenshot_3.png",
          sizes: "746/1338",
          type: "image/jpg",
          platform: "any",
        },
        {
          src: "screenshot_4.png",
          sizes: "746/1338",
          type: "image/jpg",
          platform: "any",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
