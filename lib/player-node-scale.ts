/**
 * İç saha boyutuna göre oyuncu forması / etiket çizim ölçeği.
 * 1 ≈ masaüstü referansı; küçük ekranlarda forma sahaya oranlı küçülür.
 */
export function getPlayerVisualScale(innerMinPx: number): number {
  if (!Number.isFinite(innerMinPx) || innerMinPx <= 0) return 1;
  const ref = 520;
  return Math.min(1, Math.max(0.5, innerMinPx / ref));
}

/** Çok küçük ölçekte isim bandında daha az karakter */
export function getPlayerNameMaxChars(visualScale: number): number {
  if (visualScale < 0.62) return 4;
  if (visualScale < 0.78) return 5;
  return 6;
}
