/**
 * PNG paylaşım / link paylaşımı gibi “mobil” akışların açılıp açılmayacağı.
 *
 * - `pointer: coarse`: Birincil işaretçi dokunmatik — çoğu telefon ve tablet (yatay/dikey).
 * - `max-width: 1366px`: Geniş tablet / dar pencere; iPad Pro 12.9" yatay (~1366) dahil.
 *
 * Geniş masaüstü + dar olmayan pencere (`min-width: 1367px`) ve tipik fare
 * (`pointer: fine`) → klasik indir / kopyala. Dar pencerede yine “mobil” etiketler
 * açılır (Toolbar’daki `min-[1367px]` ile uyumlu).
 */
export function isMobileLayout(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 1366px)").matches
  );
}
