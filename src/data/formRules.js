// Form alanlarının ortak kuralları. Input'ların `pattern` özelliğinde kullanılır.

// Tarayıcının type="email" kontrolü "ayse@gmail" gibi alan adında nokta olmayan
// adresleri de kabul ediyor; bildirim böyle bir adrese hiç ulaşmaz.
// Burada en az bir nokta içeren alan adı isteniyor: "ayse@gmail.com".
export const EMAIL_PATTERN = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'
export const EMAIL_HINT = 'ornek@alanadi.com biçiminde bir e-posta adresi girin'
