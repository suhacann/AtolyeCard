// Basit sabit pencere sayacı: anahtar (IP) başına dakikada en çok 10 istek.
// Sayaç sunucu örneğinin belleğinde durur. Vercel aynı anda birden çok örnek açabilir,
// bu yüzden sınır örnek başınadır; kesin sınır için ortak bir depo (ör. Upstash Redis) gerekir.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const hits = new Map() // key -> { count, resetAt }

export function checkRateLimit(key, now = Date.now()) {
  if (hits.size > 1000) {
    for (const [k, entry] of hits) if (entry.resetAt <= now) hits.delete(k)
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
