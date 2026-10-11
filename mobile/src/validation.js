// Tarayıcıdaki pattern/required kontrollerinin mobil karşılığı. Kurallar web ile ortak (formRules.js).
// Hermes 'v' bayrağını desteklemediği için 'u' ile derlenir; desenler iki bayrakta da geçerli.
import { EMAIL_PATTERN, MAX_LENGTH, MAX_QUANTITY, PHONE_PATTERN } from './shared'

const EMAIL_RE = new RegExp(`^(?:${EMAIL_PATTERN})$`, 'u')
const PHONE_RE = new RegExp(`^(?:${PHONE_PATTERN})$`, 'u')

// Hata yoksa null, varsa ekranda gösterilecek Türkçe mesaj döner.
export function validateForm(form, { requirePhone, requireEmail, hasQuantity }) {
  const name = form.name.trim()
  const email = form.email.trim()
  if (!name || name.length > MAX_LENGTH.name) return 'Lütfen adınızı yazın.'
  if (requirePhone && !PHONE_RE.test(form.phone.trim())) return 'Lütfen geçerli bir telefon numarası yazın (ör. 0555 123 45 67).'
  if (requireEmail && !email) return 'Lütfen e-posta adresinizi yazın.'
  if (email && (email.length > MAX_LENGTH.email || !EMAIL_RE.test(email))) return 'E-posta adresi ornek@alanadi.com biçiminde olmalı.'
  if (hasQuantity) {
    const quantity = Number(form.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return `Adet 1 ile ${MAX_QUANTITY} arasında olmalı.`
  }
  if (!form.consent) return 'Devam etmek için açık rıza kutusunu işaretleyin.'
  return null
}
