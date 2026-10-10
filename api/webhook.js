// Vercel sunucu fonksiyonu: POST /api/webhook
// Webhook adresi Vercel panelindeki WEBHOOK_URL ortam değişkeninden okunur.
import { forwardWebhook } from '../server/forwardWebhook.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Yalnızca POST' })
  }

  const { status, body } = await forwardWebhook(req.body, process.env.WEBHOOK_URL)
  return res.status(status).json(body)
}
