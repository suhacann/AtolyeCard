// Mobil uygulama, web sitesiyle aynı canlı API'ye gönderir (Vercel): JWT, rate limit ve
// sunucu tarafı girdi temizleme mobil istekler için de geçerlidir. Gizli adres uygulamada yoktur.
import { SITE_URL } from './shared'

const API_BASE = `${SITE_URL}api`

export async function fetchOrderToken() {
  const response = await fetch(`${API_BASE}/order-token`)
  if (!response.ok) throw new Error(`Token alınamadı (${response.status})`)
  const { token } = await response.json()
  return token
}

// token: siparişte zorunlu, stok bildiriminde gerekmez.
export async function sendWebhook(payload, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/webhook`, { method: 'POST', headers, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error(`Sunucu ${response.status} döndü`)
}
