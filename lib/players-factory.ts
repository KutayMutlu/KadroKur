import { getFormationByKey } from "./formations";
import { normalizeCaptainFlags } from "@/lib/player-fields";
import { normalizeHex } from "@/lib/jersey-kit";
import type { Player, PlayerTeamSide } from "@/types/player";

const COLORS = [
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#84cc16",
  "#22c55e",
  "#06b6d4",
  "#9333ea",
] as const;

/** Rakip varsayılan forma — tek siyah ton (ayrıştırma isim/numara ile). */
const OPPONENT_DEFAULT_JERSEY = "#171717";
const HOME_GK_START_Y = 0.04;

function normalizeJerseyNumber(value: unknown, fallbackIndex: number): string {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 2);
  if (raw.length === 0) return String(fallbackIndex + 1);
  const normalized = String(Number.parseInt(raw, 10));
  if (!normalized || normalized === "NaN") return String(fallbackIndex + 1);
  return normalized;
}

/**
 * Rakip: aynı dizilişi sahanın ters yönüne yansıtır (y → 1−y), böylece karşı yarıda görünür.
 */
export function createPlayersForFormation(
  formationKey: string,
  existing?: Player[],
  side: PlayerTeamSide = "home"
): Player[] {
  const def = getFormationByKey(formationKey);
  if (!def) return existing ?? [];

  const namePrefix = side === "away" ? "Rakip" : "Oyuncu";

  return normalizeCaptainFlags(
    def.player_positions.map((pos, i) => {
      const prev = existing?.[i];
      let y = side === "away" ? 1 - pos.y : pos.y;
      // Kaleci (1. oyuncu) kale tarafına yakın dursun; iç çizgi içinde kalacak başlangıç bandı.
      if (i === 0) {
        y = side === "away" ? Math.max(1 - HOME_GK_START_Y, y) : Math.min(HOME_GK_START_Y, y);
      }
      const fallback =
        side === "away" ? OPPONENT_DEFAULT_JERSEY : COLORS[i % COLORS.length];
      const color = normalizeHex(prev?.color) ?? fallback;
      return {
        id: prev?.id ?? crypto.randomUUID(),
        name: prev?.name ?? `${namePrefix} ${i + 1}`,
        number: normalizeJerseyNumber(prev?.number, i),
        role: prev?.role ?? (i === 0 ? "kaleci" : "orta"),
        isCaptain: prev?.isCaptain ?? false,
        color,
        x: pos.x,
        y,
        side,
      };
    })
  );
}
