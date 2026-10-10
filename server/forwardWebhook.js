// Tarayıcıdan gelen form payload'ını gizli webhook adresine iletir.
// Hem Vercel fonksiyonu (api/webhook.js) hem de geliştirme sunucusu (vite.config.js) bunu kullanır.
// Adres yalnızca sunucuda okunur; tarayıcıya giden koda hiç girmez.
const ALLOWED_EVENTS = ['order_created', 'stock_notification_requested']
const SOURCE = 'atolyekart-web'

export async function forwardWebhook(payload, webhookUrl) {
  if (!webhookUrl) {
    console.error('WEBHOOK_URL tanımlı değil')
    return { status: 500, body: { error: 'Sunucu yapılandırılmamış' } }
  }

  if (!payload || typeof payload !== 'object' || !ALLOWED_EVENTS.includes(payload.event) || payload.source !== SOURCE) {
    return { status: 400, body: { error: 'Geçersiz istek' } }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.error(`Webhook ${response.status} döndü`)
      return { status: 502, body: { error: 'İletilemedi' } }
    }
    return { status: 200, body: { ok: true } }
  } catch (error) {
    console.error('Webhook isteği başarısız:', error)
    return { status: 502, body: { error: 'İletilemedi' } }
  }
}
