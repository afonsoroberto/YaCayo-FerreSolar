import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bdv': {
        target: 'https://bdvconciliacion.banvenez.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/bdv/, ''),
        secure: true,
      },
    },
  },
})
