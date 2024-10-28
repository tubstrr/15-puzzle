// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
  }
})
