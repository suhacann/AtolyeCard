# AtölyeKart — Ahşap Atölyesi

El yapımı ahşap kuksa ve kaşık satan küçük bir atölyenin web sitesi, mobil uygulaması ve n8n otomasyonları. Kursun ana projesi BizCard'a paralel yürüyen 6 haftalık ödev projesi (6 hafta tamamlandı).

## Atölye

- **Sektör:** El yapımı ahşap mutfak ve kamp ürünleri (ahşap oyma / yontma)
- **Hedef kitle:** Kampçılar ve doğa yürüyüşçüleri, el işçiliğine ve doğal malzemeye değer verenler, hediye arayanlar
- **Ürünler:** Huş Kuksa, Ceviz Yemek Kaşığı, Kiraz Kahve Ölçü Kaşığı (tükendi)
- **Ziyaretçi ne yapar:** Kataloğa bakar, sipariş verir, tükenen ürün için stok bildirimi ister, SSS chatbotuna bakım/sipariş/kargo sorar
- **Dil ve ton:** Türkçe, fiyatlar ₺. Sıcak, sade, zanaat odaklı; abartılı pazarlama dili yok. Renkler ahşap/toprak tonları

## Mimari

```
Tarayıcı (React)  ─┐
Expo mobil uygulama ┴─► Vercel /api (JWT, rate limit, girdi temizleme) ─► WEBHOOK_URL
                                                                              │
          production: webhook.site  ◄──────────────────────────────────────────┤
          geliştirme: yerel n8n  ◄──────────────────────────────────────────────┘

Docker (bu Mac)
├─ n8n 2.42  :5678   sipariş/stok akışı → Google Sheets + Gemini; günlük özet; hata yakalayıcı;
│                    RAG belge yükleme; SSS chatbotu; public API; MCP sunucusu
├─ Qdrant 1.20  127.0.0.1:6333   SSS belgelerinin vektörleri
└─ Redis 8      127.0.0.1:6379   chatbot ziyaretçi hafızası
```

Canlı olan: web (Vercel + GitHub Pages) ve mobil (Expo Go). n8n, Qdrant ve Redis yalnızca bu Mac'te çalışır; canlı site yerel n8n'e erişemez, production webhook'u webhook.site'a gider.

## Web (React 19 + Vite)

- Çalıştırma: `npm run dev` (http://localhost:5173). `server/` değişince yeniden başlat (Vite config bağımlılıklarını izlemiyor)
- Bileşenler `src/components/`: `App` → `ProductList` (+ `CategoryFilter`) → `ProductCard` → `ProductImage` + `OrderForm` / `StockNotificationForm` (ikisinde de `ConsentCheckbox`); footer'da `SiteQrCode` ve gizlilik bağlantısı. `#gizlilik` hash'inde katalog yerine `PrivacyPolicy` (KVKK aydınlatma metni taslağı; köşeli parantezli yer tutucular atölye sahibince doldurulacak)
- Ürün verisi tek yerde: `src/data/products.js`. Alanlar: `id` (slug), `name`, `category` (`kuksa` | `kasik`), `price` (₺, sayı), `description`, `emoji`, `inStock`. Kontrol: `src/data/validateProducts.js` geliştirmede konsola `[products.js] ...` uyarısı yazar; yeni alan eklenirse kontrol de güncellenir
- `ProductCard`/`ProductImage` tek `product` objesi alır. Fiyat `src/data/formatPrice.js` (hatalıysa "Fiyat yakında"); `inStock: false` → "Tükendi" etiketi ve stok bildirimi formu, `true` → sipariş formu
- Kategoriler `src/data/categories.js`, form kuralları (`EMAIL_PATTERN`, `PHONE_PATTERN`, `MAX_LENGTH`, `MAX_QUANTITY`) `src/data/formRules.js`, site adresi `src/data/site.js` (`SITE_URL`)
- Stiller tek dosyada `src/index.css`. İlk statik HTML sürümü `legacy/index.html`
- Bileşen yazarken ve webhook gönderirken `atolyekart-standartlari` skill'ine uy. Bileşen/form/webhook değişikliğinden sonra ve commit'ten önce `standart-denetcisi` sub-agent'ını çalıştır (`.claude/agents/standart-denetcisi.md`; yalnızca okur, raporlar)

## Sunucu (`/api`, Vercel fonksiyonları)

- Tarayıcı `src/data/sendWebhook.js` ile `POST /api/webhook`'a gönderir; payload'lar `src/data/webhookPayloads.js`. `api/*.js` ince sarmalayıcı → `server/handlers.js` (`/api/webhook`, `/api/order-token`) → `server/forwardWebhook.js`. Geliştirmede aynı `routes`'u `vite.config.js`'teki eklenti sunar
- Sipariş JWT ile korunur (`server/orderToken.js`: HS256, 15 dk, tek kullanımlık `jti`). `/api/webhook` ve `/api/order-token` IP başına dakikada 10 istek (`server/rateLimit.js`, bellek içi)
- Payload sunucuda `server/sanitizePayload.js` ile doğrulanıp yeniden kurulur; yalnızca iki event (`order_created`, `stock_notification_requested`), `source: "atolyekart-web"` ve `consent: true` kabul edilir
- Güvenlik başlıkları (CSP vb.) `vercel.json`'da. Kontrol listesi `docs/guvenlik-checklist.md`. GitHub Pages'te `/api` olmadığı için formlar orada gizli

## Mobil (`mobile/`, Expo SDK 57)

- Çalıştırma: `cd mobile && npx expo start` → Expo Go ile QR (Mac'te `npx expo login` gerekli)
- Ortak veri/kurallar `mobile/src/shared.js` üzerinden `../src/data`'dan (`metro.config.js` `watchFolders`); kopya tutulmaz. Formlar canlı Vercel API'sine gönderir (`mobile/src/api.js`). Bileşenler `mobile/src/components/`, renkler `mobile/src/theme.js`

## Yayın

- **Vercel (ana):** https://atolyekart-murex.vercel.app — proje `atolyekart`, deploy `npx --yes vercel --prod` (CLI projeye kurulu değil; GitHub bağlantısı yok, push otomatik deploy etmez). Derlemede `base: '/'`
- **GitHub:** https://github.com/suhacann/AtolyeCard (public, `main` → `origin/main`)
- **GitHub Pages:** https://suhacann.github.io/AtolyeCard/ — her push'ta `.github/workflows/deploy.yml`; `base: '/AtolyeCard/'`
- **QR kod:** footer'da `SiteQrCode` (`qrcode.react`); baskı için `qr/atolyekart-qr.png`, `npm run qr` ile üretilir. Adres değişirse `SITE_URL` ile birlikte güncelle

## n8n (Docker, http://localhost:5678)

Repodaki workflow JSON'ları `n8n/` altında; credential, Sheet ve token kimliği içermez (içe aktarırken eklenir ya da n8n'de seçilir). n8n 2.x'te değişiklik "Publish" ile yayına girer; CLI ile içe aktarılan workflow `n8n publish:workflow` + `docker restart n8n` ister. Sub-workflow'lar da yayında olmalı.

| Workflow | n8n ID | Ne yapar |
|---|---|---|
| `siparis-workflow.json` | `PUAcp9tnJCGqbO3x` | Webhook `POST /webhook/atolyekart-siparis` → Switch "Hangi form?" → her dal Ortak doğrulama'yı çağırır. **Sipariş:** Code (hazırlanma süresi: kuksa 5 + 2/ek adet, kaşık 3 + 1/ek adet, en fazla 21 iş günü) → Sheet "AtölyeKart Siparişler" (Sayfa1) → Gemini (`gemini-3-flash-preview`) teşekkür maili taslağı (gönderilmez). **Stok:** "Stok Bildirimleri" sekmesi → AI Agent "Alternatif öneri" (Code Tool `stoktaki_urunler`) → öneri taslağı. Bilinmeyen event → Stop and Error |
| `dogrulama-workflow.json` | `atolyeKartDogru1` | Ortak doğrulama sub-workflow'u: ürün ID'si, e-posta, rıza, ad, siparişte telefon/adet (kurallar `sanitizePayload.js` ile aynı). Geçersizse hata fırlatır, mesajda kişisel veri yok |
| `hata-workflow.json` | `atolyeKartHata01` | Error Workflow: Sheet "Hatalar" sekmesine tarih, workflow, execution, node, mesaj, bağlantı. Elle (test) çalıştırmada tetiklenmez; yayındaki URL'ye `curl` ile test edilir |
| `gunluk-ozet-workflow.json` | `atolyeKartOzet01` | Her gün 21:00 (Europe/Istanbul) Sayfa1'den o günün siparişlerini ürüne göre gruplar, "Günlük Özet" sekmesine yazar. Geçmiş gün için "Özet günü" node'una tarih elle yazılır |
| `rag-belge-yukleme-workflow.json` | `atolyeKartRag001` | Form http://localhost:5678/form/atolyekart-belge → aynı `metadata.belge`'nin eski parçalarını siler → Recursive splitter → Qdrant |
| `sss-chatbot-workflow.json` | `atolyeKartChat01` | SSS chatbotu (aşağıda). MCP'ye açık tek workflow |

**Elle senkron tutulanlar** (`products.js` değişirse güncelle): doğrulama sub-workflow'undaki ürün→kategori kataloğu, `stoktaki_urunler` aracındaki stok listesi, günlük özetteki fiyatlar. Hazırlanma süresi kuralı hem sipariş Code node'unda hem `siparis-sss` belgesinde yazılı.

**Google Sheets bağlantısı:** Google Cloud uygulaması "Testing" modundaysa OAuth yenileme anahtarı 7 günde bir düşer ("needs to be reconnected"); sipariş ve Hata yakalayıcı birlikte hata verir. n8n → Credentials → Google Sheets account → yeniden bağlan (ya da Google Cloud'da uygulamayı "In production" yap).

## SSS chatbotu (RAG + Redis hafıza)

- **Belgeler:** `rag/kaynak/*.html` → `textutil -convert docx` ile `rag/*.docx`. `bakim-rehberi` (sürüm 1, 12 parça) ve `siparis-sss` (sürüm 2: ücretsiz kargo 750 ₺, 8 parça); chunk 500, örtüşme 50. Metadata: `belge`, `versiyon`, `chunkBoyutu`, `yuklenmeTarihi`. Belge güncellenince yükleme formundan yeni sürüm numarasıyla yüklenir
- **Qdrant:** koleksiyon `atolyekart_sss` (Gemini `gemini-embedding-001`, 3072 boyut, cosine). Panel http://localhost:6333/dashboard. n8n credential "Qdrant (yerel)" (`qdrantYerel00001`, `http://host.docker.internal:6333`)
- **Sohbet:** public hosted chat http://localhost:5678/webhook/8e3f6a2d-1c57-4b8e-a0d4-6f2b9c1e7a02/chat → "Önceki oturum mu?" (IF) → AI Agent "SSS asistanı" (Gemini, sıcaklık 0.2) + `atolye_belgeleri` (Qdrant retrieve-as-tool, topK 4) + "Ziyaretçi hafızası (Redis)"
- **Sistem mesajı kuralları:** her bilgi sorusunda aracı çağır, yalnızca bu turun parçalarından cevap ver; sohbet geçmişi bilgi kaynağı değil, yalnızca bağlam (ad, sorulan ürün, "onu" gibi göndermeler); belgede yoksa uydurma, sabit "bilgi yok" cümlesi; sonunda "(Kaynak: belge, sürüm N)"; "siz" hitabı, unvan yok, en fazla 100 kelime; kişisel veri isteme
- **Hafıza:** Redis Chat Memory, sohbet penceresinin `sessionId`'si başına ayrı geçmiş, son 10 mesaj, 24 saat TTL. Anahtar `<sessionId>__Ziyaret_i_haf_zas___Redis_`; kontrol `docker exec redis redis-cli --scan`. n8n credential "Redis (yerel)" (`redisYerel000001`, `host.docker.internal:6379`)
- **Sayfa yenileme:** pencere `sessionId`'yi localStorage'da tutar ve açılışta `loadPreviousSession` ister. Chat Trigger'da "Load Previous Session" = **Manually** → "Geçmişi oku (Redis)" → "Görünür mesajlar" (Code; hafızadaki araç çağrılarını ve belge parçalarını atar, yalnızca ziyaretçi + bot metni döner). "From Memory" seçilirse ham belge parçaları ekranda balon olarak görünür, kullanma

## n8n API ve MCP

- **Public API:** http://localhost:5678/api/v1, başlık `X-N8N-API-KEY`. Key n8n → Settings → n8n API; `~/.n8n_api_key` (izin 600) ya da `N8N_API_KEY`. Haftalık sorgu: `python3 scripts/n8n-haftalik-siparis.py [YYYY-AA-GG]` — sipariş workflow'unun o haftaki (Pazartesi–Pazar, Europe/Istanbul) execution'larını çeker, "Sipariş Webhook" gövdesindeki `event`'e göre sipariş/stok bildirimini ayırır, ürün başına adet ve başarısızları sayar (kişisel veri yazdırmaz). n8n eski execution'ları budar; kalıcı sipariş kaydı Google Sheet'tir
- **MCP:** n8n'in yerleşik MCP sunucusu http://localhost:5678/mcp-server/http (Settings → Instance-level MCP). Claude Code'a yalnızca bu proje için (`local` scope, `~/.claude.json`) access token ile bağlı: `claude mcp add --transport http n8n http://localhost:5678/mcp-server/http --header "Authorization: Bearer $(cat ~/.n8n_mcp_token)"`. OAuth bu Mac'te çalışmadı (Safari açamadı, Chrome'da "Invalid state parameter"). Yeni MCP sunucusu eklenince Claude Code yeniden başlatılmalı. Yalnızca SSS chatbotu MCP'ye açık (`availableInMCP: true`); sipariş workflow'u kapalı tutulur, çünkü çalıştırılırsa Sheet'e yazar. Chatbotu çalıştırmak: `execute_workflow` + `triggerNodeName: "Ziyaretçi sorusu"` + `inputs.chatInput`

## Docker ve gizli değerler

Bu Mac'te `/usr/local/bin/docker` kırık bir bağlantı; komutları `PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"` ile çalıştır. Docker Desktop kapalıysa `open -a Docker`. Konteynerler `--restart unless-stopped`.

| Konteyner | İmaj | Port | Volume |
|---|---|---|---|
| `n8n` | `docker.n8n.io/n8nio/n8n:2.42.7` | 5678 | `n8n_data` |
| `qdrant` | `qdrant/qdrant` (1.20) | `127.0.0.1:6333` | `qdrant_storage` |
| `redis` | `redis:8-alpine` (AOF açık, parola yok) | `127.0.0.1:6379` | `redis_data` |

| Gizli değer | Nerede durur | Asla |
|---|---|---|
| `WEBHOOK_URL`, `JWT_SECRET` | Geliştirme: `.env.development.local`; production: yalnızca Vercel paneli. Örnek: `.env.example` | `VITE_` öneki (tarayıcıya girer), repo |
| Gemini, Google Sheets, Qdrant, Redis credential'ları | n8n'in kendi credential deposu | Repodaki workflow JSON'ları |
| n8n API key | `~/.n8n_api_key` (600) | Repo, sohbet |
| n8n MCP token | `~/.n8n_mcp_token` (600) + `~/.claude.json` (local scope) | Repo, sohbet |

Ödev PDF'leri (`docs/Odev_AtolyeKart_Hafta*.pdf`) public repoya eklenmez.

## Bilinen sınırlar

- n8n, Qdrant, Redis ve chatbot yalnızca yerelde; canlı site webhook.site'a gider
- Qdrant ve Redis'te parola yok (yalnızca 127.0.0.1'e açık)
- Chatbotun "geçmişi bilgi kaynağı sayma" kuralı yalnızca sistem mesajında; hafıza araç çağrılarını ve belge parçalarını da saklıyor
- Rate limit sayacı bellek içi, sunucu örneği başına
- KVKK aydınlatma metnindeki yer tutucular doldurulmadı; mail ve öneri taslakları gönderilmiyor
- Ürün listesi n8n'in üç yerinde elle senkron (yukarıda)

## Geçmiş

| Hafta | Konu | Özet |
|---|---|---|
| 1 | React, skill, webhook | Statik HTML → React; ürün verisi dizide, "Tükendi" etiketi, hata yönetimi; proje skill'i + `standart-denetcisi`; GitHub + Pages + QR; sipariş ve stok bildirimi formları (webhook.site ile test) |
| 2 | Yayın ve güvenlik | Git worktree; Vercel; webhook secret sunucuda; JWT + rate limit; KVKK rıza kutusu + aydınlatma metni taslağı; güvenlik checklist'i; Strix taraması (1 orta bulgu → tek kullanımlık `jti`); Expo mobil port. `docs/hafta-2-ozet.pdf` |
| 3 | n8n | Docker'da n8n; webhook → Google Sheets; Gemini teşekkür maili (prompt v2: cinsiyet tahmini ve süslü dil kaldırıldı). `docs/hafta-3-ozet.pdf` |
| 4 | n8n ileri | Günlük özet (Schedule + Loop); Ortak doğrulama sub-workflow'u + Hata yakalayıcı; stok dalında AI Agent alternatif önerisi. `docs/hafta-4-ozet.pdf` |
| 5 | RAG | Qdrant + iki Word belgesi + metadata'lı yükleme formu (yeniden yükleme eskisini siler); SSS chatbotu; `siparis-sss` sürüm 2 (750 ₺); chunk denemesi (300/500/1000); hafızadan eski cevap hatası düzeltildi. `docs/hafta-5-ozet.pdf` |
| 6 | Redis, MCP, API | 6.1 Redis ziyaretçi hafızası (n8n yeniden başlasa da, sayfa yenilense de hatırlıyor; #50–54); 6.2 n8n MCP Claude Code'a bağlandı, chatbot MCP'den çalıştırıldı (#95); 6.3 API ile haftalık sipariş sorgusu (16–22.11: 3 sipariş / 6 adet, 1 stok bildirimi, 4 başarısız). Google Sheets OAuth düşmüştü, yeniden bağlandı; final kontrol canlıda geçti. `docs/hafta-6-ozet.pdf` |
