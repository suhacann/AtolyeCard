// Tarayıcıdan gelen payload'ı doğrular ve temizler. Yalnızca sözleşmedeki alanlar,
// sunucunun kendi ürün verisinden yeniden kurulur; fazladan gelen alanlar atılır.
// Döner: { payload } ya da { error }.
import { products } from '../src/data/products.js'
import { EMAIL_PATTERN, MAX_LENGTH, MAX_QUANTITY, PHONE_PATTERN } from '../src/data/formRules.js'
import { buildOrderPayload, buildStockNotificationPayload } from '../src/data/webhookPayloads.js'

const EMAIL_RE = new RegExp(`^(?:${EMAIL_PATTERN})$`, 'v')
const PHONE_RE = new RegExp(`^(?:${PHONE_PATTERN})$`, 'v')

// Metin değilse boş; kontrol karakterleri (satır sonu, NUL, C1), Unicode satır/paragraf ayırıcıları ve
// yazı yönünü değiştiren karakterler silinir, kenar boşlukları kırpılır.
const UNSAFE_CHARS = /[\u0000-\u001F\u007F-\u009F\u2028\u2029\u202A-\u202E\u2066-\u2069]/g
const cleanText = (value) => (typeof value === 'string' ? value.replace(UNSAFE_CHARS, '').trim() : '')

export function sanitizePayload(raw) {
  const product = products.find((p) => p.id === raw.productId)
  if (!product) return { error: 'Bilinmeyen ürün' }

  const name = cleanText(raw.name)
  const email = cleanText(raw.email)
  if (!name || name.length > MAX_LENGTH.name) return { error: 'Geçersiz ad' }
  if (email.length > MAX_LENGTH.email || (email && !EMAIL_RE.test(email))) return { error: 'Geçersiz e-posta' }

  if (raw.event === 'order_created') {
    if (!product.inStock) return { error: 'Ürün stokta değil' }
    const phone = cleanText(raw.phone)
    if (!PHONE_RE.test(phone)) return { error: 'Geçersiz telefon' }
    if (!Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > MAX_QUANTITY) return { error: 'Geçersiz adet' }
    return { payload: buildOrderPayload(product, { name, phone, email, quantity: raw.quantity, consent: true }) }
  }

  if (raw.event === 'stock_notification_requested') {
    if (product.inStock) return { error: 'Ürün zaten stokta' }
    if (!email) return { error: 'E-posta gerekli' }
    return { payload: buildStockNotificationPayload(product, { name, email, consent: true }) }
  }

  return { error: 'Geçersiz istek' }
}
