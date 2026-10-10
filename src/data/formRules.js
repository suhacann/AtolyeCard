// Form alanlarının ortak kuralları. Tarayıcıda input özellikleri (pattern, maxLength, max),
// sunucuda server/sanitizePayload.js aynı kuralları kullanır.

// Tarayıcının type="email" kontrolü "ayse@gmail" gibi alan adında nokta olmayan
// adresleri de kabul ediyor; bildirim böyle bir adrese hiç ulaşmaz.
// Burada en az bir nokta içeren alan adı isteniyor: "ayse@gmail.com".
export const EMAIL_PATTERN = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'
export const EMAIL_HINT = 'ornek@alanadi.com biçiminde bir e-posta adresi girin'

// Rakam, boşluk, +, -, parantez; 7–20 karakter. (\s değil düz boşluk: satır sonu kabul edilmez.)
export const PHONE_PATTERN = '[0-9 \\-\\+\\(\\)]{7,20}'
export const PHONE_HINT = 'Örneğin 0555 123 45 67'

export const MAX_LENGTH = { name: 80, phone: 20, email: 254 }
export const MAX_QUANTITY = 99
