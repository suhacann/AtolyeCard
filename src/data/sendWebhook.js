// Sipariş ve stok bildirimi formlarının tek gönderim noktası.
// webhook.site tarayıcıdan gelen JSON isteklerine CORS izni vermediği için
// istek Content-Type başlığı olmadan ve 'no-cors' modunda gider; gövde yine JSON metnidir.
// Bu modda yanıt okunamaz: yalnızca ağ hatası yakalanır (Hafta 1 testi için yeterli).
const url = import.meta.env.VITE_WEBHOOK_URL

// Adres yalnızca yerelde (.env.local) tanımlı. Yayındaki sitede tanımsız olduğu için
// formlar gösterilmez; ziyaretçi bilgisi herkese açık bir test kutusuna gitmez (Hafta 2'ye kadar).
export const isWebhookConfigured = Boolean(url)

export async function sendWebhook(payload) {
  if (!url) {
    throw new Error('VITE_WEBHOOK_URL tanımlı değil (.env.local dosyasına bakın)')
  }

  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  })
}
