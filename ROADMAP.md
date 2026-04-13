# KadroKur Product Roadmap

Bu roadmap, profesyonel ürün vizyonu için önceliklendirilmiş geliştirme sırasını içerir.

## 1) Editor Core Stabilizasyonu (Aktif)
- Player node sistemi ve preset davranışlarının tutarlı hale getirilmesi
- Konum sıfırlama ve preset uygulama akışının idempotent olması
- Undo / Redo desteği (board snapshot tabanlı)
- Temel edit akışlarında regressionsız deneyim

## 2) Sequence MVP
- Keyframe oluşturma / silme
- Basit playback (play/pause/seek)
- Paylaşılabilir animasyon bağlantısı

## 3) Asset MVP (Forma / Avatar)
- Oyuncu fotoğrafı yükleme
- Takım forması yükleme ve fallback skin sistemi
- Görsel optimizasyon ve güvenli yükleme akışı

## 4) Collaboration
- Paylaşım izinleri (owner / editor / viewer)
- Takım içi ortak düzenleme akışları
- Kaydedilmiş sürümler arasında geçiş

## 5) Advanced Tactical Layer
- Koşu yolu / ısı haritası katmanları
- Taktik olay tetikleyicileri
- Gelişmiş analiz çıktıları

---

## Mevcut sprint notu
Şu an 1. aşama üzerinde ilerleniyor. İlk adım: `EditorClient` için undo/redo altyapısı.
