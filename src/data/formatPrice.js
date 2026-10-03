// Fiyatı ekranda gösterilecek biçime çevirir: 1450 → "1.450 ₺".
// Fiyat hatalı girilmişse "NaN ₺" yerine sade bir metin döner.
export function formatPrice(price) {
  return Number.isFinite(price) ? `${new Intl.NumberFormat('tr-TR').format(price)} ₺` : 'Fiyat yakında'
}
