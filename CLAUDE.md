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
- Bileşenler `src/components/` altında: `ProductList` → `ProductCard` → `ProductImage`
- Ürün verisi tek yerde: `src/data/products.js` (dizi). Alanlar: `id` (okunabilir slug), `name`, `category` (`kuksa` | `kasik`), `price` (₺, sayı), `description`, `emoji`, `inStock`
- `ProductCard` tek bir `product` objesi alır; fiyatı kendisi biçimlendirir (hatalı fiyatta "Fiyat yakında"), `inStock: false` ise "Tükendi" etiketi gösterir
- Veri kontrolü: `src/data/validateProducts.js` — `ProductList` geliştirme sırasında (`import.meta.env.DEV`) çalıştırır, sorunları konsola `[products.js] ...` uyarısı olarak yazar. Yeni alan eklenirse kontrol de güncellenmeli
- Stiller tek dosyada: `src/index.css`
- İlk statik HTML sürümü referans için `legacy/index.html` içinde

## Durum

- Hafta 1.1: Statik HTML, 3 ürün (tamam)
- Hafta 1.2: React'e geçiş + kart hover efekti (tamam)
- Hafta 1.3: Ürün verisi diziye taşındı (tamam)
- Hafta 1.3+: "Tükendi" etiketi (tamam)
- Hafta 1.4: Hata yönetimi turu — kasıtlı hata + debug pratiği, ürün verisi kontrolü (tamam)
