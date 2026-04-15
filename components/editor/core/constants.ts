import type { AdaptiveDropConfig } from "@/lib/player-node-scale";
import type { MatchFormatKey } from "@/lib/formations";

export const DEFAULT_MATCH_FORMAT: MatchFormatKey = "7v7";
export const DEFAULT_FORMATION = "2-3-1";
export const HISTORY_LIMIT = 50;
export const EPS = 0.0001;

export const DEFAULT_DROP_CONFIG: AdaptiveDropConfig = {
  minDistNorm: 0.05,
  radiiNorm: [0, 0.012, 0.022, 0.032, 0.042],
};
