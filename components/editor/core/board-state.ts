import { createPlayersForFormation } from "@/lib/players-factory";
import { applyPresetToPlayers, type TacticalPresetKey } from "@/lib/presets";
import type { Player } from "@/types/player";
import type { CanvasState } from "@/types/tactic";
import type { BoardSnapshot } from "./types";

export function rebuildHomePlayers(
  formationKey: string,
  presetKey: TacticalPresetKey,
  prev: Player[],
  includeOpponent: boolean
): Player[] {
  const homePrev = prev.filter((p) => (p.side ?? "home") === "home");
  const awayPrev = includeOpponent ? prev.filter((p) => p.side === "away") : [];
  const home = applyPresetToPlayers(
    createPlayersForFormation(formationKey, homePrev, "home"),
    presetKey
  );
  return includeOpponent ? [...home, ...awayPrev] : home;
}

export function rebuildAwayPlayers(
  formationKey: string,
  presetKey: TacticalPresetKey,
  prev: Player[]
): Player[] {
  const homePrev = prev.filter((p) => (p.side ?? "home") === "home");
  const awayPrev = prev.filter((p) => p.side === "away");
  const away = applyPresetToPlayers(
    createPlayersForFormation(formationKey, awayPrev, "away"),
    presetKey
  );
  return [...homePrev, ...away];
}

export function snapshotsEqual(a: BoardSnapshot, b: BoardSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function buildCanvasState(
  teamName: string,
  opponentTeamName: string,
  homeFormationKey: string,
  awayFormationKey: string,
  homePresetKey: TacticalPresetKey,
  awayPresetKey: TacticalPresetKey,
  players: Player[],
  attackFlip: boolean
): CanvasState {
  const opp = opponentTeamName.trim();
  return {
    teamName,
    ...(opp ? { opponentTeamName: opp } : {}),
    formation_key: homeFormationKey,
    ...(awayFormationKey === homeFormationKey
      ? {}
      : { opponent_formation_key: awayFormationKey }),
    preset_key: homePresetKey === "default" ? null : homePresetKey,
    ...(awayPresetKey === "default" ? {} : { opponent_preset_key: awayPresetKey }),
    players,
    ...(attackFlip ? { attack_flip: true } : {}),
    pitchVersion: 1,
  };
}
