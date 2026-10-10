import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { forwardWebhook } from './server/forwardWebhook.js'

// Geliştirmede /api/webhook'u Vercel fonksiyonuyla aynı kodla sunar.
// WEBHOOK_URL .env.development.local'dan okunur (VITE_ öneki olmadığı için tarayıcıya gitmez).
function devWebhookApi(webhookUrl) {
  return {
    name: 'atolyekart-dev-webhook-api',
    configureServer(server) {
      server.middlewares.use('/api/webhook', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end(JSON.stringify({ error: 'Yalnızca POST' }))
        }

        let payload = null
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          payload = JSON.parse(raw)
        } catch {
          // payload null kalır, forwardWebhook 400 döner
        }

        const { status, body } = await forwardWebhook(payload, webhookUrl)
        res.statusCode = status
        res.end(JSON.stringify(body))
      })
    },
  }
}

// GitHub Pages siteyi /AtolyeCard/ altında yayınlar; Vercel (VERCEL=1) ve geliştirme kök adresi kullanır.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isVercel = Boolean(process.env.VERCEL)
  const hasApi = command === 'serve' || isVercel

  return {
    plugins: [react(), devWebhookApi(env.WEBHOOK_URL)],
    base: command === 'build' && !isVercel ? '/AtolyeCard/' : '/',
    define: {
      'import.meta.env.VITE_HAS_API': JSON.stringify(String(hasApi)),
    },
  }
})
