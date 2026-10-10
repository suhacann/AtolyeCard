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
- Sınıf adları bileşen adından türetilir, BEM tarzı: blok `.product-card`; bileşenin içindeki öğe `.product-card__price`; durum `.product-card--sold-out`. Başlık gibi düz etiketler için `.product-card h3` da olur. Sayfa iskeleti (`App.jsx`'teki header/main/footer) `site-` önekini kullanır: `.site-header`, `.site-footer`.
- Renk paleti ahşap/toprak tonları: koyu kahve `#5a3d28`, metin `#3b2a1e`, vurgu `#8a5a2b`, kart zemini `#fffaf2`, sayfa zemini `#f6f0e6`, kenarlık `#e2d3bd`, vurgulu kenarlık (hover) `#c9a67e`, soluk metin `#7a6652`. Bunların dışında renk kullanma.
- Tasarım değişikliği istendiğinde ürün verisine ve bileşen prop'larına dokunma.

### Formlar
- Kontrollü input (`useState`), her input'un bir `<label>`'ı olur.
- Gönderim sırasında buton devre dışı ve metni "Gönderiliyor…" olur.
- Başarıda ekranda Türkçe onay mesajı, hatada "Bir sorun oldu, lütfen tekrar deneyin." gösterilir. Hata sessizce yutulmaz.

## 2. Webhook formatı

### Gönderim
- Tarayıcı webhook adresini bilmez. Formlar `src/data/sendWebhook.js` → `sendWebhook(payload)` ile sitenin kendi uç noktasına gönderir: `POST /api/webhook`, `Content-Type: application/json`. Yanıt `ok` değilse hata fırlatılır.
- Uç nokta `api/webhook.js` (Vercel fonksiyonu); asıl iş `server/forwardWebhook.js` içinde. Geliştirmede aynı kodu `vite.config.js`'teki eklenti sunar (`npm run dev` yeterli).
- Adres sunucuda `WEBHOOK_URL` ortam değişkeninden okunur. **`VITE_` öneki kullanma**: `VITE_` ile başlayan her değer derlenen JS'e açık metin olarak girer.
  - Geliştirme: `.env.development.local` (git'e girmez; örnek `.env.example`)
  - Production: yalnızca Vercel paneli → Settings → Environment Variables → Production
- Sunucu yalnızca sözleşmedeki iki `event`'i ve `source: "atolyekart-web"`'i kabul eder, gerisine 400 döner. Yeni event eklenirse `server/forwardWebhook.js`'teki `ALLOWED_EVENTS` de güncellenmeli.
- `/api` yalnızca Vercel'de ve geliştirmede var; GitHub Pages derlemesinde `isWebhookConfigured` false olur ve formlar gösterilmez.

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
