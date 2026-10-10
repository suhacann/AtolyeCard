// Sipariş ve stok bildirimi formlarının tek gönderim noktası.
// İstek sitenin kendi sunucu fonksiyonuna (/api/webhook) gider; gizli webhook adresini
// yalnızca sunucu bilir (server/forwardWebhook.js). Tarayıcı koduna adres girmez.
const ENDPOINT = `${import.meta.env.BASE_URL}api/webhook`

// /api yalnızca Vercel'de ve geliştirme sunucusunda var; GitHub Pages statik olduğu için orada formlar gösterilmez.
export const isWebhookConfigured = import.meta.env.VITE_HAS_API === 'true'

export async function sendWebhook(payload) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Sunucu ${response.status} döndü`)
  }
}
