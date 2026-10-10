// Sipariş ve stok bildirimi formlarının tek gönderim noktası.
// İstek sitenin kendi sunucu fonksiyonuna (/api/webhook) gider; gizli webhook adresini
// yalnızca sunucu bilir (server/forwardWebhook.js). Tarayıcı koduna adres girmez.
const API_BASE = `${import.meta.env.BASE_URL}api`

// /api yalnızca Vercel'de ve geliştirme sunucusunda var; GitHub Pages statik olduğu için orada formlar gösterilmez.
export const isWebhookConfigured = import.meta.env.VITE_HAS_API === 'true'

// "Sipariş Ver" için sunucunun imzaladığı kısa ömürlü JWT (bkz. server/orderToken.js).
export async function fetchOrderToken() {
  const response = await fetch(`${API_BASE}/order-token`)
  if (!response.ok) {
    throw new Error(`Token alınamadı (${response.status})`)
  }
  const { token } = await response.json()
  return token
}

// token: siparişte zorunlu, stok bildiriminde gerekmez.
export async function sendWebhook(payload, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/webhook`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Sunucu ${response.status} döndü`)
  }
}
