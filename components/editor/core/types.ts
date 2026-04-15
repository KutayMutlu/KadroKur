import type { MatchFormatKey } from "@/lib/formations";
import type { TacticalPresetKey } from "@/lib/presets";
import type { Player } from "@/types/player";

export type BoardSnapshot = {
  matchFormat: MatchFormatKey;
  homeFormationKey: string;
  awayFormationKey: string;
  homePresetKey: TacticalPresetKey;
  awayPresetKey: TacticalPresetKey;
  players: Player[];
  opponentTeamName: string;
  attackFlip: boolean;
};
