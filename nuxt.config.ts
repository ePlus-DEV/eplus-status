// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    // Product page generated on-demand, revalidates in background
    "/products/**": { swr: 3600 },
    // Blog post generated on-demand once until next deploy
    "/blog/**": { isr: true },
    // Admin dashboard renders only on client-side
    "/admin/**": { ssr: false },
    // Add cors headers on API routes
    "/api/**": { cors: true },
    // Redirects legacy urls
    "/old-page": { redirect: "/new-page" },
  },
  modules: ["@nuxthq/ui", "nuxt-highcharts"],
  colorMode: {
    preference: "light",
  },
  nitro: {
    preset: "netlify",
  },
});
