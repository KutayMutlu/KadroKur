import { getFormationByKey } from "./formations";
import { normalizeCaptainFlags } from "@/lib/player-fields";
import type { Player } from "@/types/player";

const COLORS = [
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#84cc16",
  "#22c55e",
  "#06b6d4",
  "#9333ea",
] as const;

function normalizeJerseyNumber(value: unknown, fallbackIndex: number): string {
  const raw = String(value ?? "").replace(/\D/g, "").slice(0, 2);
  if (raw.length === 0) return String(fallbackIndex + 1).padStart(2, "0");
  if (raw.length === 1) return `0${raw}`;
  return raw === "00" ? "01" : raw;
}

export function createPlayersForFormation(
  formationKey: string,
  existing?: Player[]
): Player[] {
  const def = getFormationByKey(formationKey);
  if (!def) return existing ?? [];

  return normalizeCaptainFlags(
    def.player_positions.map((pos, i) => {
      const prev = existing?.[i];
      return {
        id: prev?.id ?? crypto.randomUUID(),
        name: prev?.name ?? `Oyuncu ${i + 1}`,
        number: normalizeJerseyNumber(prev?.number, i),
        role: prev?.role ?? (i === 0 ? "kaleci" : "orta"),
        isCaptain: prev?.isCaptain ?? false,
        color: prev?.color ?? COLORS[i % COLORS.length],
        x: pos.x,
        y: pos.y,
      };
    })
  );
}
