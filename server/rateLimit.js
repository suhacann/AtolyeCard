// Basit sabit pencere sayacı: anahtar başına dakikada en çok 10 istek. Anahtar uç nokta + IP'dir
// (ör. "webhook:1.2.3.4"), böylece her uç noktanın sayacı ayrıdır.
// Sayaç sunucu örneğinin belleğinde durur. Vercel aynı anda birden çok örnek açabilir,
// bu yüzden sınır örnek başınadır; kesin sınır için ortak bir depo (ör. Upstash Redis) gerekir.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const hits = new Map() // key -> { count, resetAt }
let nextSweepAt = 0

export function checkRateLimit(key, now = Date.now()) {
  // Süresi dolan kayıtlar en fazla dakikada bir topluca silinir; IP bellekte birkaç dakikadan uzun kalmaz (bkz. PrivacyPolicy).
  if (now >= nextSweepAt) {
    for (const [k, entry] of hits) if (entry.resetAt <= now) hits.delete(k)
    nextSweepAt = now + WINDOW_MS
  }

  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { allowed: true }
}
