import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { audioPlugin } from './scripts/audio-plugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), audioPlugin()],
  server: {
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/*.har', '**/audio-sources/**'],
    },
  },
})
