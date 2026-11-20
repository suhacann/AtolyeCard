# Final planı — AtölyeKart Asistanı

Son teslim: **3 Aralık 2026** · Teslim: en fazla 5 dakikalık ekran kaydı (demo → mimari → kararlar)

Final görevi BizCard üzerine tanımlı; bu projede altı haftada kurulan parçalar AtölyeKart'ta olduğu için asistan AtölyeKart üzerine kuruluyor. "BizCard bağlantısı"nın karşılığı: sitedeki sohbet kutusu → asistan veri akışı. (Eğitmene AtölyeKart ile ilerlemenin uygun olduğu teyit edilecek.)

## Hedef mimari

```
Site (React sohbet kutusu)
  → /api/asistan                 rate limit + girdi temizleme
  → n8n Webhook                  "AtölyeKart · Asistan · ..."
  → AI Agent (Gemini)
       ├─ RAG:    atolye_belgeleri (Qdrant)          bakım, kargo, iade
       ├─ Hafıza: Redis, ziyaretçi başına
       ├─ Araç:   urun_katalogu  → sub-workflow      stok + fiyat (/api/products'tan)
       └─ Araç:   teslim_tarihi  → sub-workflow      sektöre özel özellik
  → cevap + kaynak
Hata ağı: araçlarda yeniden deneme · Agent patlarsa nazik yedek cevap · Hata yakalayıcı → Sheet "Hatalar"
```

## Zorunlu parçalar

| Parça | Bugün nerede | Finalde |
|---|---|---|
| Webhook | Sipariş webhook'u; chatbotta Chat Trigger | Asistan için gerçek Webhook, siteden çağrılıyor |
| AI adımı | Gemini: teşekkür maili, SSS asistanı, stok önerisi | Asistan Agent'ı |
| RAG | Qdrant + iki belge (metadata, sürüm) | Aynı, Agent'ın aracı |
| Hafıza | Redis, ziyaretçi başına, 24 saat | Aynı, asistana bağlı |
| Hata ağı | Hata yakalayıcı + Form doğrulama sub-workflow'u | + yeniden deneme, yedek cevap, kasıtlı hata demosu |
| Sektöre özel | — | **Teslim tarihi:** "Bugün 2 Huş Kuksa sipariş versem ne zaman elimde olur?" → hazırlanma süresi + iş günü + kargo → tarih |

## Eksikler

1. Asistan workflow'u: Webhook girişi + Agent + RAG + Redis + iki araç
2. `/api/products`: ürün verisi tek kaynaktan; n8n'deki 3 elle senkron kopya kalkar
3. `urun_katalogu` ve `teslim_tarihi` sub-workflow'ları; sipariş akışı da hazırlanma süresini buradan alır (kural tek yerde)
4. Hata ağı: araç ve Agent node'larında yeniden deneme, hata çıkışından yedek cevap, Günlük özet'e de Error Workflow
5. Sitede sohbet kutusu + `/api/asistan` (yerelde; canlı site yerel n8n'e erişemiyor)
6. Video metni, prova, kayıt, Drive'a yükleme

## İki haftalık plan

| Tarih | İş | Durum |
|---|---|---|
| 21–23 Kas | Bu plan; isimlendirme standardı; Drive yedekleme workflow'u, ilk yedek Drive'da | standart ✓, yedekleme kuruldu (Drive bağlantısı bekleniyor) |
| 24–26 Kas | `/api/products`; `urun_katalogu` + `teslim_tarihi` sub-workflow'ları; asistan workflow'u | |
| 27–28 Kas | Hata ağı; sipariş akışını sub-workflow'lara bağlama | |
| 29–30 Kas | Sohbet kutusu + `/api/asistan`; uçtan uca test | |
| 1–2 Ara | Video metni (~2 dk demo, ~2 dk mimari, ~1 dk kararlar), prova, kayıt, Drive | |
| 3 Ara | Yedek gün | |

## Ders ödevi ve kursu bitirme koşulları

- [x] n8n API'den workflow listesini çektim — `python3 scripts/n8n-workflow-listesi.py`
- [ ] Otomatik yedekleme workflow'unu kurdum — `AtölyeKart · Bakım · Drive yedekleme` (her gece 03:00 + elle), ilk yedek Drive'a düşünce işaretlenecek
- [x] Tüm workflow'larım isimlendirme standardına uyuyor — aşağıda, betik kontrol ediyor
- [x] Final görevimin kapsamı net — bu belge
- [x] Final asistanının eksik parçalarını listele ve iki haftalık plana yay — bu belge

## Workflow isimlendirme standardı

`AtölyeKart · <Alan> · <Ne yapar>` — sub-workflow'lar `(sub)` ile biter.

| Alan | Ne için |
|---|---|
| Sipariş | Site formlarından gelen sipariş ve stok bildirimi |
| Ortak | Başka workflow'ların çağırdığı sub-workflow'lar |
| Hata | Error Workflow'lar |
| Rapor | Zamanlanmış özetler |
| RAG | Belge yükleme ve belgeden cevap |
| Asistan | Final asistanı |
| Bakım | Yedekleme gibi işletme işleri |

Node adları Türkçe ve ne yaptığını söyler ("Yedek dosyası", "Drive'a yükle"); n8n ID'leri değişmediği için Error Workflow ve sub-workflow bağlantıları adlandırmadan etkilenmez.
