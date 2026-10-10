// server/handlers.js'teki bir uç noktayı Vercel fonksiyonuna çevirir.
export function toVercelHandler(handle) {
  return async function handler(req, res) {
    let body = null
    try {
      body = req.body ?? null // Vercel JSON'u ayrıştırır; bozuk JSON'da hata fırlatır
    } catch {
      // body null kalır, forwardWebhook 400 döner
    }

    // x-real-ip'i Vercel kendisi yazar (istemci değiştiremez); rate limit anahtarı budur.
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
    const response = await handle({ method: req.method, headers: req.headers, ip, body }, process.env)

    for (const [name, value] of Object.entries(response.headers ?? {})) res.setHeader(name, value)
    res.status(response.status).json(response.body)
  }
}
