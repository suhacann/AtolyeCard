// "Sipariş Ver" formunun JWT'si. Sunucu JWT_SECRET ile imzalar; tarayıcı anahtarı hiç görmez.
// Token kimlik kanıtı değildir (site herkese açık): isteğin sitenin kendi formundan,
// kısa süre önce alınmış bir token'la geldiğini gösterir. Webhook'a doğrudan istek atılmasını zorlaştırır.
// Her token tek kullanımlıktır: benzersiz jti'si ilk kullanımda harcanır, aynı token ikinci kez kabul edilmez.
import { randomUUID } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'

const ISSUER = 'atolyekart'
const AUDIENCE = 'order-form'
const LIFETIME = '15m'

// Harcanan token'lar süreleri dolana kadar burada tutulur (jti -> son geçerlilik, ms).
// Rate limit sayacı gibi sunucu örneğinin belleğindedir; kesin koruma için ortak depo gerekir.
const usedTokens = new Map()
let nextSweepAt = 0

const toKey = (secret) => new TextEncoder().encode(secret)

export function createOrderToken(secret) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(LIFETIME)
    .sign(toKey(secret))
}

// Token geçerliyse ve daha önce kullanılmadıysa harcar ve true döner.
export async function consumeOrderToken(token, secret, now = Date.now()) {
  let payload
  try {
    payload = (await jwtVerify(token, toKey(secret), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['HS256'],
      currentDate: new Date(now), // süre kontrolü ile harcanan-token temizliği aynı saati kullanır
    })).payload
  } catch {
    return false
  }

  if (now >= nextSweepAt) {
    for (const [jti, expiresAt] of usedTokens) if (expiresAt <= now) usedTokens.delete(jti)
    nextSweepAt = now + 60_000
  }

  if (!payload.jti || usedTokens.has(payload.jti)) return false
  usedTokens.set(payload.jti, payload.exp * 1000)
  return true
}
