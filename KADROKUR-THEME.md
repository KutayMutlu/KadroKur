# KadroKur — Gece Sahası UI Teması (referans)

**Dosya adı:** `KADROKUR-THEME.md`  
**Sürüm:** 2  
**Amaç:** Bu metni başka bir sohbette yapıştırdığınızda veya bu dosya adını söylediğinizde, asistanın aynı görsel dili `app/globals.css`, `app/layout.tsx` ve sayfa bileşenlerine yeniden uygulaması.

---

## Koyu ve açık tema

- **Kütüphane:** `next-themes` — `app/providers.tsx` içinde `ThemeProvider` (`attribute="class"`, `defaultTheme="dark"`, `storageKey="kadrokur-theme"`, `enableSystem`).
- **CSS:** `:root` = **koyu** (varsayılan, ilk boyamada doğru renk); `html.light` = **açık** tema tokenları (aynı isimli değişkenlerin açık değerleri).
- **Geçiş:** `components/theme-toggle.tsx` (güneş/ay). Tercih `localStorage`’da saklanır.
- Yeni bileşenlerde renk için **sabit hex yazma**; `var(--foreground)`, `var(--accent)`, `var(--muted)` vb. kullan — böylece iki tema otomatik uyumlu kalır.
- Vurgu üstü metin: `var(--on-accent)` (koyuda koyu yazı, açıkta açık krem).

---

## Kimlik

- **İsim:** KadroKur “Gece Sahası” (night pitch)
- **His:** Kapalı halı saha / gece maçı; koyu zemin, çim çizgisi, volt-limon vurgu, sıcak sarı aksan
- **Genel kural:** Düz gri kurumsal tema kullanma; kontrastı `--accent` ve `--foreground` ile ver

---

## Tipografi

| Rol | Font | Kaynak |
|-----|------|--------|
| Başlıklar / marka | **Outfit** | `next/font/google`, CSS değişkeni `--font-outfit` |
| Gövde | **DM Sans** | `next/font/google`, CSS değişkeni `--font-dm` |

`app/layout.tsx` içinde `html` sınıfı: `` `${outfit.variable} ${dmSans.variable}` ``

Kullanım:

- Başlıklar: `style={{ fontFamily: 'var(--font-display)' }}` veya `font-family: var(--font-display)`  
- Gövde (varsayılan): `body` zaten `var(--font-body)` — `--font-display` ve `--font-body` `:root` içinde tanımlı

---

## Renk ve tokenlar

**Koyu:** `:root` (tablo aşağıda). **Açık:** `app/globals.css` içinde `html.light { ... }` bloğu — aynı token isimleri, farklı değerler.

| Token | Koyu (ör.) | Kullanım |
|-------|------------|----------|
| `--bg-deep` | `#060a0e` | Ana arka plan |
| `--bg-elevated` | `#0e161c` | Üst bar, hafif yükselen yüzeyler |
| `--bg-card` | `rgba(18, 32, 42, 0.75)` | Kartlar, paneller, cam hissi |
| `--border-subtle` | `rgba(120, 200, 160, 0.12)` | İnce çerçeve |
| `--border-glow` | `rgba(190, 255, 80, 0.35)` | Hover / vurgu çerçevesi |
| `--foreground` | `#e8f4ec` | Ana metin |
| `--muted` | `#7a9e8c` | İkincil metin |
| `--accent` | `#bef264` | Birincil vurgu (volt limon) |
| `--accent-dim` | `#86a85c` | İkincil vurgu |
| `--accent-hot` | `#fde047` | Gradient / sıcak vurgu |
| `--pitch-line` | `rgba(180, 255, 200, 0.15)` | Saha çizgisi dekor |
| `--background` | `var(--bg-deep)` | Eski bileşen uyumu |
| `--card` | `var(--bg-card)` | Button, Input, paneller |
| `--on-accent` | koyu metin / açık krem | Accent dolgulu buton yazısı |

*(Tam açık tema sayısal değerleri için `globals.css` içindeki `html.light` bloğuna bak.)*

---

## Arka plan sınıfları (`app/globals.css`)

### `.bg-pitch-night`

- Koyu taban + üstten yeşilimsi ışık (radial) + dikey çim şeritleri (`repeating-linear-gradient`) + alt gradient  
- Tam sayfa sayfalar: `min-h-screen bg-pitch-night` (ana sayfa, editör, paylaşım)

### `.hero-glow`

- Üst sağda hafif limon ışıması — hero bölümünde `absolute` katman olarak kullanılır

### Animasyonlar

- `.animate-float-soft` — 5s hafif yüzen dekor kartları için  
- `.animate-pulse-line` — rozet içi nokta nabzı için  

---

## Yerleşim kalıpları

1. **Tam sayfa shell:** dış `div`: `min-h-screen bg-pitch-night`; içerik `mx-auto max-w-5xl` veya `max-w-6xl` + yatay padding
2. **Üst bar (landing):** `border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 backdrop-blur-md`
3. **CTA birincil:** `bg-[var(--accent)]`, metin koyu `#142018` veya benzeri koyu yeşil; gölge `shadow-lg shadow-[var(--accent)]/25`
4. **CTA ikincil:** `border border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-sm`, hover’da `border-[var(--border-glow)]`
5. **Başlık gradient satırı:** `bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hot)] bg-clip-text text-transparent`

---

## Yeniden uygulama kontrol listesi (AI / geliştirici)

1. `app/globals.css` içinde `:root` tokenları ve `.bg-pitch-night`, `.hero-glow`, animasyon sınıfları yukarıdaki gibi olsun  
2. `app/layout.tsx` içinde Outfit + DM Sans yüklensin, `html`’e font değişkenleri verilsin  
3. Yeni sayfalar `min-h-screen bg-pitch-night` ile tema ile uyumlu olsun  
4. Metin renkleri: birincil `text-[var(--foreground)]` veya `var(--foreground)`, ikincil `var(--muted)`  
5. Mevcut shadcn tarzı bileşenler `var(--card)`, `var(--accent)`, `var(--foreground)` kullanmaya devam edebilir — `:root` içinde eşlendi  

---

## Dosya konumları (bu repo)

| Ne | Nerede |
|----|--------|
| Tokenlar ve yardımcı sınıflar | `app/globals.css` |
| Fontlar + `ThemeProvider` sarmalayıcı | `app/layout.tsx`, `app/providers.tsx` |
| Tema anahtarı (güneş/ay) | `components/theme-toggle.tsx` |
| Landing düzeni | `app/page.tsx` |
| Kayıtlı taktik listesi stilleri | `app/client-tactics.tsx` |

---

## Kısa metin (sohbete yapıştırmak için)

```
Tema: KadroKur Gece Sahası — KADROKUR-THEME.md
Arka plan: #060a0e, çim şeritli .bg-pitch-night
Vurgu: #bef264 (accent), gradient için #fde047
Font: Outfit başlık, DM Sans gövde
Kartlar: rgba(18,32,42,0.75), border rgba(120,200,160,0.12)
```

Bu blok, dosyayı taşıyamadığınız kısa anlar için yeterli özet verir; tam detay için bu dosyanın tamamını kullanın.
