import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      globalThis.process?.env?.VERCEL_GIT_COMMIT_SHA || new Date().toISOString(),
    ),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
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
          { src: '/Bayan-Icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/Bayan-Icon.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/Bayan-Icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,ico,png,svg,jpg,jpeg,webp,woff2}'],
      },
    }),
  ],
})