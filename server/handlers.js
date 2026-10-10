// API uç noktaları. Her biri { method, headers, ip, body } alır, { status, headers?, body } döner;
// Vercel'de server/vercelHandler.js, geliştirmede vite.config.js bu biçime çevirir.
// env: WEBHOOK_URL ve JWT_SECRET (yalnızca sunucuda).
import { forwardWebhook } from './forwardWebhook.js'
import { createOrderToken, verifyOrderToken } from './orderToken.js'
import { checkRateLimit } from './rateLimit.js'

const methodNotAllowed = (allowed) => ({ status: 405, headers: { Allow: allowed }, body: { error: `Yalnızca ${allowed}` } })
const notConfigured = (name) => {
  console.error(`${name} tanımlı değil`)
  return { status: 500, body: { error: 'Sunucu yapılandırılmamış' } }
}

// GET /api/order-token → { token }
export async function handleOrderToken(request, env) {
  if (request.method !== 'GET') return methodNotAllowed('GET')
  if (!env.JWT_SECRET) return notConfigured('JWT_SECRET')

  return {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
    body: { token: await createOrderToken(env.JWT_SECRET) },
  }
}

// POST /api/webhook — IP başına dakikada 10 istek; sipariş için geçerli JWT gerekir.
export async function handleWebhook(request, env) {
  if (request.method !== 'POST') return methodNotAllowed('POST')

  const limit = checkRateLimit(request.ip)
  if (!limit.allowed) {
    return { status: 429, headers: { 'Retry-After': String(limit.retryAfter) }, body: { error: 'Çok fazla istek' } }
  }

  if (request.body?.event === 'order_created') {
    if (!env.JWT_SECRET) return notConfigured('JWT_SECRET')
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
    if (!token || !(await verifyOrderToken(token, env.JWT_SECRET))) {
      return { status: 401, body: { error: 'Geçersiz ya da süresi dolmuş token' } }
    }
  }

  return forwardWebhook(request.body, env.WEBHOOK_URL)
}

export const routes = {
  '/api/webhook': handleWebhook,
  '/api/order-token': handleOrderToken,
}
