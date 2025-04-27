// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@prisma/nuxt'],
  
  // Add this prisma configuration for JavaScript
  prisma: {
    client: {
      engineType: 'library'
    }
  }
})