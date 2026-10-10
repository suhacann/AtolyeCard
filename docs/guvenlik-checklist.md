# AtölyeKart — Deploy öncesi güvenlik checklist'i (Hafta 2.6)

Canlı: https://atolyekart-murex.vercel.app · Kontrol tarihi: Ekim 2026

| # | Madde | Durum | Kanıt |
|---|---|---|---|
| 1 | `.env` dosyası `.gitignore`'da | ✅ | `.gitignore`: `.env*` (+ `!.env.example`). `git check-ignore` ile `.env`, `.env.local`, `.env.development.local`, `.env.production.local` doğrulandı; git'te yalnızca değeri boş `.env.example` var, geçmişte secret yok |
| 2 | Tüm secret'lar Vercel Environment Variables'ta | ✅ | `WEBHOOK_URL` ve `JWT_SECRET` — Production, Sensitive. Kodda ve derlenen JS'te yok (`VITE_` öneki kullanılmıyor, canlı bundle'da arandı). Geliştirme değerleri ayrı (`.env.development.local`) |
| 3 | Gönder butonu çift gönderime kapalı | ✅ | Gönderim sırasında buton `disabled` + "Gönderiliyor…"; `handleSubmit` başında `status === 'sending'` kontrolü; başarıdan sonra form yerine onay mesajı çıkar |
| 4 | HTTPS + güvenlik başlıkları (`vercel.json`) | ✅ | HTTP → HTTPS 308 yönlendirme, HSTS (Vercel). `vercel.json`: CSP (`default-src 'self'`, inline script/style yok, `frame-ancestors 'none'`), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`. Canlıda `curl -I` ile doğrulandı; CSP altında sayfa headless Chrome'da ihlalsiz çiziliyor |
| 5 | `npm audit` temiz | ✅ | `found 0 vulnerabilities`. Önceki 34 açık yalnızca `vercel` CLI'ın alt bağımlılıklarındaydı; CLI projeden çıkarıldı, deploy `npx --yes vercel --prod` |
| 6 | Form girdileri sanitize ediliyor | ✅ | Sunucu `server/sanitizePayload.js`: ürün adı/stok sunucu verisinden, ad ≤80, telefon deseni, e-posta deseni ≤254, adet tam sayı 1–99; kontrol/yön karakterleri silinir; fazladan alanlar atılır; payload yeniden kurulur. Tarayıcıda aynı kurallar `pattern`/`maxLength`/`max`. React çıktıyı zaten kaçışlar. Ek: sipariş JWT ile korunur, `/api/*` IP başına 10 istek/dk |
| 7 | KVKK rıza checkbox'ı + Privacy Policy yayında | ✅ (taslak) | İki formda zorunlu rıza kutusu; payload'da `consent: true`, sunucu zorunlu tutar. Aydınlatma metni `/#gizlilik`. Veri sorumlusu, bildirim hizmeti ve saklama süresi yer tutucu olarak duruyor; gerçek kullanımdan önce doldurulmalı ve hukukçuya kontrol ettirilmeli (KVKK m. 9, 2024 değişikliği) |
| 8a | Claude denetimi: kritik bulgu yok | ✅ | `standart-denetcisi` güvenlik taraması: kritik/yüksek bulgu yok. Orta/düşük bulgulardan düzeltilenler: token uç noktasına rate limit, genişletilmiş karakter temizliği, açık event kontrolü, aralıklı sayaç temizliği, loglarda host sızıntısı |
| 8b | Strix taraması | ⏳ | Henüz yapılmadı (Docker + LLM API anahtarı gerekli) |

## Bilinen sınırlar (kabul edildi)

- Rate limit sayacı bellek içi, sunucu örneği başına; kesin sınır için ortak depo (ör. Upstash Redis) gerekir.
- JWT kimlik kanıtı değildir (site herkese açık); 15 dk içinde tekrar kullanılabilir. Webhook'a doğrudan istek atmayı zorlaştırır, etkisini rate limit sınırlar.
- CSP yalnızca Vercel'de geçerli; GitHub Pages kopyasında başlık yok (orada form da yok).
