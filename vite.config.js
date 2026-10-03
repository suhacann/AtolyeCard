import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages siteyi /AtolyeCard/ altında yayınlar; geliştirmede kök adres kalır.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/AtolyeCard/' : '/',
}))
