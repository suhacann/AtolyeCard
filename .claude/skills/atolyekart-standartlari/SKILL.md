---
name: atolyekart-standartlari
description: AtölyeKart projesinin bileşen standartları ve webhook payload formatı. AtölyeKart'ta yeni React bileşeni yazarken, mevcut bir bileşeni değiştirirken, ürün verisine alan eklerken ya da sipariş / stok bildirimi gibi bir webhook gönderirken kullan.
---

# AtölyeKart standartları

## 1. Bileşen standartları

### Dosya ve isimlendirme
- Her bileşen kendi dosyasında: `src/components/BilesenAdi.jsx`, PascalCase, `export default function BilesenAdi`.
- Veri ve yardımcı fonksiyonlar `src/data/` altında, bileşen dosyalarında veri tutulmaz.
- Kod (değişken, fonksiyon, prop adı) İngilizce; ekranda görünen metinler ve yorumlar Türkçe.

### Ürün verisi
- Tek kaynak `src/data/products.js`. Ürünü bileşene her zaman tek bir `product` objesi olarak ver (`<ProductCard product={p} />`), alanları tek tek prop yapma.
- Listelerde `key` olarak her zaman `product.id` kullan, dizi index'i kullanma.
- Fiyat veride sayıdır; ekranda `tr-TR` biçimiyle ve sonuna ` ₺` eklenerek gösterilir (`1.450 ₺`).
- Ürüne yeni alan eklersen `src/data/validateProducts.js` içindeki kontrolü de güncelle.

### Stil
- Tüm stiller `src/index.css` içinde, düz CSS. Inline `style` ve CSS kütüphanesi kullanma.
- Sınıf adları bileşen adından türetilir: `.product-card`, `.product-card h3`; durum için BEM tarzı ek: `.product-card--sold-out`.
- Renk paleti ahşap/toprak tonları: koyu kahve `#5a3d28`, metin `#3b2a1e`, vurgu `#8a5a2b`, kart zemini `#fffaf2`, sayfa zemini `#f6f0e6`, kenarlık `#e2d3bd`.
- Tasarım değişikliği istendiğinde ürün verisine ve bileşen prop'larına dokunma.

### Formlar
- Kontrollü input (`useState`), her input'un bir `<label>`'ı olur.
- Gönderim sırasında buton devre dışı ve metni "Gönderiliyor…" olur.
- Başarıda ekranda Türkçe onay mesajı, hatada "Bir sorun oldu, lütfen tekrar deneyin." gösterilir. Hata sessizce yutulmaz.

## 2. Webhook formatı

### Gönderim
- Adres koda yazılmaz, `import.meta.env.VITE_WEBHOOK_URL` ile okunur. Değer proje kökündeki `.env.local` dosyasındadır (git'e girmez).
- Gönderim tek bir yardımcı fonksiyondan yapılır: `src/data/sendWebhook.js` → `sendWebhook(payload)`.
- `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })`.
- webhook.site tarayıcıdan gelen isteklerde CORS sorunu çıkarırsa `Content-Type` başlığını kaldırıp `mode: 'no-cors'` kullan; Hafta 1 testi için yeterli.
- Hafta 1'de istek doğrudan tarayıcıdan gider. Secret koruma ve backend/API route Hafta 2'nin konusu, şimdi ekleme.

### Payload sözleşmesi
Alan adları ve sırası sabittir, başka alan ekleme, hiçbirini atlama.

**Sipariş** (`event: "order_created"`)

| Alan | Tip | Not |
|---|---|---|
| `event` | string | Her zaman `"order_created"` |
| `name` | string | Formdan, zorunlu |
| `productId` | string | `product.id` |
| `productName` | string | `product.name` |
| `phone` | string | Formdan, zorunlu |
| `email` | string | Formdan, isteğe bağlı; boşsa `""` |
| `quantity` | number | Formdan, en az 1, varsayılan 1 |
| `source` | string | Her zaman `"atolyekart-web"` |

**Stok bildirimi** (`event: "stock_notification_requested"`)

| Alan | Tip | Not |
|---|---|---|
| `event` | string | Her zaman `"stock_notification_requested"` |
| `name` | string | Formdan, zorunlu |
| `productId` | string | `product.id` |
| `productName` | string | `product.name` |
| `email` | string | Formdan, zorunlu |
| `source` | string | Her zaman `"atolyekart-web"` |

Stok bildirimi formu yalnızca `inStock: false` olan ürünlerde gösterilir; sipariş butonu yalnızca `inStock: true` olanlarda.

### Örnek
```json
{
  "event": "order_created",
  "name": "Ayşe Yılmaz",
  "productId": "hus-kuksa",
  "productName": "Huş Kuksa",
  "phone": "05551234567",
  "email": "",
  "quantity": 2,
  "source": "atolyekart-web"
}
```
