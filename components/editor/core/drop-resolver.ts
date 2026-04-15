import type { AdaptiveDropConfig } from "@/lib/player-node-scale";
import type { Player } from "@/types/player";

const DROP_ANGLE_STEPS = 16;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function candidatePositions(
  x: number,
  y: number,
  radiiNorm: number[]
): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (const radius of radiiNorm) {
    if (radius === 0) {
      out.push({ x: clamp01(x), y: clamp01(y) });
      continue;
    }
    for (let i = 0; i < DROP_ANGLE_STEPS; i += 1) {
      const t = (i / DROP_ANGLE_STEPS) * Math.PI * 2;
      out.push({
        x: clamp01(x + Math.cos(t) * radius),
        y: clamp01(y + Math.sin(t) * radius),
      });
    }
  }
  return out;
}

function minDistanceToOthers(
  id: string,
  pos: { x: number; y: number },
  players: Player[]
): number {
  let min = Number.POSITIVE_INFINITY;
  for (const p of players) {
    if (p.id === id) continue;
    const d = Math.hypot(pos.x - p.x, pos.y - p.y);
    if (d < min) min = d;
  }
  return Number.isFinite(min) ? min : Number.POSITIVE_INFINITY;
}

export function resolveDropPosition(
  id: string,
  x: number,
  y: number,
  players: Player[],
  dropConfig: AdaptiveDropConfig
): { x: number; y: number } {
  const candidates = candidatePositions(x, y, dropConfig.radiiNorm);
  let best = candidates[0] ?? { x: clamp01(x), y: clamp01(y) };
  let bestMin = -1;
  for (const c of candidates) {
    const minDist = minDistanceToOthers(id, c, players);
    if (minDist >= dropConfig.minDistNorm) return c;
    if (minDist > bestMin) {
      best = c;
      bestMin = minDist;
    }
  }
  return best;
}
