import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      globalThis.process?.env?.NODE_ENV === 'development'
        ? 'dev'
        : globalThis.process?.env?.VERCEL_GIT_COMMIT_SHA || new Date().toISOString(),
    ),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})