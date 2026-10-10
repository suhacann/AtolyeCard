import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { routes } from './server/handlers.js'

// Geliştirmede /api/* uç noktalarını Vercel fonksiyonlarıyla aynı kodla (server/handlers.js) sunar.
// WEBHOOK_URL ve JWT_SECRET .env.development.local'dan okunur (VITE_ öneki olmadığı için tarayıcıya gitmez).
function devApi(env) {
  return {
    name: 'atolyekart-dev-api',
    configureServer(server) {
      for (const [path, handle] of Object.entries(routes)) {
        server.middlewares.use(path, async (req, res) => {
          let body = null
          try {
            let raw = ''
            for await (const chunk of req) raw += chunk
            if (raw) body = JSON.parse(raw)
          } catch {
            // body null kalır, forwardWebhook 400 döner
          }

          const request = { method: req.method, headers: req.headers, ip: req.socket.remoteAddress, body }
          let response
          try {
            response = await handle(request, env)
          } catch (error) {
            console.error(`${path} hata verdi:`, error)
            response = { status: 500, body: { error: 'Sunucu hatası' } }
          }
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          for (const [name, value] of Object.entries(response.headers ?? {})) res.setHeader(name, value)
          res.end(JSON.stringify(response.body))
        })
      }
    },
  }
}

// GitHub Pages siteyi /AtolyeCard/ altında yayınlar; Vercel (VERCEL=1) ve geliştirme kök adresi kullanır.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isVercel = Boolean(process.env.VERCEL)
  const hasApi = command === 'serve' || isVercel

  return {
    plugins: [react(), devApi(env)],
    base: command === 'build' && !isVercel ? '/AtolyeCard/' : '/',
    define: {
      'import.meta.env.VITE_HAS_API': JSON.stringify(String(hasApi)),
    },
  }
})
