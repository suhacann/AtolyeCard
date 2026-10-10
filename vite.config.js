import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages siteyi /AtolyeCard/ altında yayınlar; Vercel (VERCEL=1) ve geliştirme kök adresi kullanır.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' && !process.env.VERCEL ? '/AtolyeCard/' : '/',
}))
