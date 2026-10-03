# AtölyeKart — Ahşap Atölyesi

El yapımı ahşap ürünler satan küçük bir atölyenin web sitesi. Kursun ana projesi BizCard'a paralel yürüyen 6 haftalık ödev projesi.

## Atölye

- **Sektör:** El yapımı ahşap mutfak ve kamp ürünleri (ahşap oyma / yontma)
- **Hedef kitle:** Kampçılar ve doğa yürüyüşçüleri, el işçiliğine ve doğal malzemeye değer verenler, hediye arayanlar
- **Ürün kategorileri:** Kuksa (ahşap bardak), tahta kaşık (yemek kaşığı, ölçü kaşığı)

## Ziyaretçi ne yapar

- Ürün kataloğuna bakar
- Sipariş verir
- Tükenen ürün geri geldiğinde haberdar olmak ister

## Dil ve ton

- Site dili Türkçe, fiyatlar ₺
- Sıcak, sade, zanaat odaklı bir ton; abartılı pazarlama dili yok
- Renkler: ahşap/toprak tonları (kahverengi, krem)

## Teknik yapı

- React 19 + Vite. Çalıştırma: `npm run dev` (http://localhost:5173)
- Bileşenler `src/components/` altında: `App` → `ProductList` → `ProductCard` → `ProductImage` + `OrderForm` / `StockNotificationForm`; footer'da `SiteQrCode`. Yardımcılar ve veri `src/data/` altında
- Ürün verisi tek yerde: `src/data/products.js` (dizi). Alanlar: `id` (okunabilir slug), `name`, `category` (`kuksa` | `kasik`), `price` (₺, sayı), `description`, `emoji`, `inStock`
- `ProductCard` ve `ProductImage` tek bir `product` objesi alır. Fiyatı `src/data/formatPrice.js` biçimlendirir (hatalı fiyatta "Fiyat yakında"); `inStock: false` ise kartta "Tükendi" etiketi çıkar
- Formlar: stoktaki üründe `OrderForm` ("Sipariş Ver"), tükenende `StockNotificationForm` ("Stok Bildirimi İste"). Gönderim `src/data/sendWebhook.js`, payload'lar `src/data/webhookPayloads.js`. webhook.site CORS izni vermediği için `mode: 'no-cors'` (yanıt okunamaz, yalnız ağ hatası yakalanır)
- Webhook adresi yalnızca yerelde: `.env.local` → `VITE_WEBHOOK_URL` (git'e girmez). Tanımsızsa (`isWebhookConfigured` false) formlar gösterilmez; bu yüzden yayındaki sitede formlar bilinçli olarak gizli. Canlıya alma + secret koruma Hafta 2'de
- Veri kontrolü: `src/data/validateProducts.js` — `ProductList` geliştirme sırasında (`import.meta.env.DEV`) çalıştırır, sorunları konsola `[products.js] ...` uyarısı olarak yazar. Yeni alan eklenirse kontrol de güncellenmeli
- Stiller tek dosyada: `src/index.css`
- İlk statik HTML sürümü referans için `legacy/index.html` içinde
- Bileşen yazarken ve webhook gönderirken `atolyekart-standartlari` skill'ine uy
- Denetim: `.claude/agents/standart-denetcisi.md` sub-agent'ı kodu bu skill'e göre okur ve raporlar (dosya değiştirmez). Bileşen/form/webhook değişikliğinden sonra ve commit'ten önce çalıştır
- GitHub: https://github.com/suhacann/AtolyeCard (public, `main` → `origin/main`)
- Yayın: https://suhacann.github.io/AtolyeCard/ — `main`'e her push'ta `.github/workflows/deploy.yml` derleyip GitHub Pages'e yükler. `vite.config.js` build'de `base: '/AtolyeCard/'` kullanır
- QR kod: adres `src/data/site.js` (`SITE_URL`). Sitede footer'daki `SiteQrCode` bileşeni (`qrcode.react`); baskı için `qr/atolyekart-qr.png`, `npm run qr` ile yeniden üretilir. Adres değişirse ikisini birlikte güncelle

## Durum

- Hafta 1.1: Statik HTML, 3 ürün (tamam)
- Hafta 1.2: React'e geçiş + kart hover efekti (tamam)
- Hafta 1.3: Ürün verisi diziye taşındı (tamam)
- Hafta 1.3+: "Tükendi" etiketi (tamam)
- Hafta 1.4: Hata yönetimi turu — kasıtlı hata + debug pratiği, ürün verisi kontrolü (tamam)
- Hafta 1.5: Proje skill'i `.claude/skills/atolyekart-standartlari/` (bileşen standartları + webhook formatı); git deposu ve ilk commit; GitHub'a bağlama; GitHub Pages yayını + QR kod; `standart-denetcisi` sub-agent'ı ve ilk denetimin düzeltmeleri (tamam)
- Denetimin açık soruları kapatıldı: iki ara ton palete eklendi, kart öğe sınıfları BEM (`.product-card__price` vb.), `validateProducts` `description` ve `emoji`'yi de kontrol ediyor (tamam)
- Hafta 1.6: İki webhook özelliği — sipariş formu + stok bildirimi formu, webhook.site ile tarayıcıdan test edildi, payload'lar sözleşmeye uygun geldi (tamam)
