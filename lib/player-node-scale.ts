export interface AdaptiveDropConfig {
  minDistNorm: number;
  radiiNorm: number[];
}

export interface AdaptiveNodeMetrics {
  visualScale: number;
  nameMaxChars: number;
  hitInsetX: number;
  hitInsetYTop: number;
  hitInsetYBottom: number;
  drop: AdaptiveDropConfig;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * İç saha boyutuna göre oyuncu forması / etiket çizim ölçeği.
 * 1 ≈ masaüstü referansı; küçük ekranlarda forma sahaya oranlı küçülür.
 */
export function getPlayerVisualScale(innerMinPx: number): number {
  if (!Number.isFinite(innerMinPx) || innerMinPx <= 0) return 1;
  const ref = 520;
  return clamp(innerMinPx / ref, 0.5, 1);
}

/** Çok küçük ölçekte isim bandında daha az karakter */
export function getPlayerNameMaxChars(visualScale: number): number {
  if (visualScale < 0.62) return 4;
  if (visualScale < 0.78) return 5;
  return 6;
}

/**
 * Tam adaptif metrik paketi:
 * - görsel ölçek
 * - dokunma/sürükleme alanı
 * - oyuncular arası drop-time çakışma çözümleme mesafesi/radyusu
 */
export function getAdaptiveNodeMetrics(innerW: number, innerH: number): AdaptiveNodeMetrics {
  const safeW = Math.max(1, innerW);
  const safeH = Math.max(1, innerH);
  const innerMin = Math.min(safeW, safeH);
  const visualScale = getPlayerVisualScale(innerMin);
  const nameMaxChars = getPlayerNameMaxChars(visualScale);

  // Hit area: küçük ekranlarda erişilebilirliği koru, büyükte gereksiz büyütme.
  const hitBase = clamp(innerMin * 0.085, 22, 48);
  const hitInsetX = clamp(Math.max(46 * visualScale, hitBase), 22, 52);
  const hitInsetYTop = clamp(Math.max(34 * visualScale, hitBase * 0.85), 22, 52);
  const hitInsetYBottom = clamp(Math.max(34 * visualScale, hitBase * 0.85), 22, 52);

  // Çakışma çözümleme: normalize mesafeyi iç sahanın kısa kenarına göre üret.
  const desiredDropPx = clamp(24 * visualScale, 18, 28);
  const minDistNorm = clamp(desiredDropPx / innerMin, 0.035, 0.06);
  const radiiNorm = [
    0,
    minDistNorm * 0.35,
    minDistNorm * 0.6,
    minDistNorm * 0.85,
    minDistNorm * 1.1,
  ];

  return {
    visualScale,
    nameMaxChars,
    hitInsetX,
    hitInsetYTop,
    hitInsetYBottom,
    drop: { minDistNorm, radiiNorm },
  };
}
