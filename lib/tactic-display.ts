import type { CanvasState } from "@/types/tactic";

/**
 * Liste / özet satırı: iki takım adı varsa "A - B", yalnız biri varsa o isim.
 */
export function formatTeamMatchupLine(
  state: Pick<CanvasState, "teamName" | "opponentTeamName"> | null | undefined
): string | null {
  const home = state?.teamName?.trim();
  const away = state?.opponentTeamName?.trim();
  if (home && away) return `${home} - ${away}`;
  if (home) return home;
  if (away) return away;
  return null;
}
