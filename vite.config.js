import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Bayan-Icon.png', 'favicon.ico', 'favicon.svg', 'icons.svg'],
      manifest: {
        name: 'منصة بيان - تعليم اللغة العربية',
        short_name: 'بيان',
        description: 'منصة بيان: باقات اشتراك، دروس فيديو، واختبارات تفاعلية للثانوية',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#05070A',
        background_color: '#05070A',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: '/Bayan-Icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Bayan-Icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/Bayan-Icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-z]+\.[a-z]+\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
})