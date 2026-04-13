import type { Player } from "@/types/player";
import type { JerseyPatternId, ResolvedJerseyKit } from "@/types/jersey";

const FALLBACK_PRIMARY = "#1e3a5f";

function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace("#", "");
  if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function normalizeHex(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const c = raw.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  if (/^[0-9a-fA-F]{6}$/.test(c)) return `#${c}`;
  return null;
}

/** Birincil renge göre ikincil ton (şerit / koyu panel) — kullanıcı vermezse. */
export function defaultSecondaryFromPrimary(primaryHex: string): string {
  const rgb = parseRgb(primaryHex);
  if (!rgb) return "#0f172a";
  const f = 0.58;
  return `rgb(${Math.round(rgb.r * f)},${Math.round(rgb.g * f)},${Math.round(rgb.b * f)})`;
}

export function lightenHex(hex: string, t: number): string {
  const rgb = parseRgb(hex);
  if (!rgb) return hex;
  const L = (n: number) => Math.round(n + (255 - n) * t);
  return `rgb(${L(rgb.r)},${L(rgb.g)},${L(rgb.b)})`;
}

export function darkenHex(hex: string, t: number): string {
  const rgb = parseRgb(hex);
  if (!rgb) return hex;
  const D = (n: number) => Math.round(n * (1 - t));
  return `rgb(${D(rgb.r)},${D(rgb.g)},${D(rgb.b)})`;
}

/** Yazı / detay rengi: arka plana göre kontrast. */
export function contrastAccentForPrimary(primaryHex: string): string {
  const rgb = parseRgb(primaryHex);
  if (!rgb) return "#f8fafc";
  const y = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return y > 165 ? "#0f172a" : "#f8fafc";
}

/** Göğüs numarası için ince kontur (okunabilirlik). */
export function numberStrokeForFill(fillHex: string): string {
  const rgb = parseRgb(fillHex);
  if (!rgb) return "rgba(0,0,0,0.4)";
  const y = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return y > 165 ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.32)";
}

/**
 * `Player` üzerinden çizim paketi.
 * - `color`: ana forma rengi (mevcut alan)
 * - `kit`: isteğe bağlı desen + ikincil renk (ileride UI)
 */
export function resolveJerseyKit(player: Player): ResolvedJerseyKit {
  const primary = normalizeHex(player.color) ?? FALLBACK_PRIMARY;
  const kit = player.kit;
  const pattern: JerseyPatternId = kit?.pattern ?? "solid";
  const secondary = normalizeHex(kit?.secondary) ?? defaultSecondaryFromPrimary(primary);
  const accent = normalizeHex(kit?.accent) ?? contrastAccentForPrimary(primary);
  return { pattern, primary, secondary, accent };
}
