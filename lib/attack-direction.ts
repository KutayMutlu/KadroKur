/**
 * Atak yönü yalnızca görünüm / sürükleme dönüşümü — kayıtlı `player.y` takım bağımsız aynıdır.
 * Rakip (away) de aynı sahada olduğu için ekstra kural gerekmez: hepsi `y_vis` ile birlikte döner.
 */

export function visualAttackY(storedY: number, attackFlip: boolean): number {
  return attackFlip ? 1 - storedY : storedY;
}

/** Sürükleme bittiğinde ekrandaki y_vis’ten tekrar saklanan y’ye */
export function storedAttackYFromVisual(visualY: number, attackFlip: boolean): number {
  return attackFlip ? 1 - visualY : visualY;
}
