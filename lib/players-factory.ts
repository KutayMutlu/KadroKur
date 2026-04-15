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

function normalizeJerseyNumber(value: unknown, fallbackIndex: number): string {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 2);
  if (raw.length === 0) return String(fallbackIndex + 1).padStart(2, "0");
  if (raw.length === 1) return `0${raw}`;
  return raw === "00" ? "01" : raw;
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
      const y = side === "away" ? 1 - pos.y : pos.y;
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
