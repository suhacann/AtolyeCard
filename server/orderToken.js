// "Sipariş Ver" formunun JWT'si. Sunucu JWT_SECRET ile imzalar; tarayıcı anahtarı hiç görmez.
// Token kimlik kanıtı değildir (site herkese açık): isteğin sitenin kendi formundan,
// kısa süre önce alınmış bir token'la geldiğini gösterir. Webhook'a doğrudan istek atılmasını zorlaştırır.
import { SignJWT, jwtVerify } from 'jose'

const ISSUER = 'atolyekart'
const AUDIENCE = 'order-form'
const LIFETIME = '15m'

const toKey = (secret) => new TextEncoder().encode(secret)

export function createOrderToken(secret) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(LIFETIME)
    .sign(toKey(secret))
}

export async function verifyOrderToken(token, secret) {
  try {
    await jwtVerify(token, toKey(secret), { issuer: ISSUER, audience: AUDIENCE, algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}
