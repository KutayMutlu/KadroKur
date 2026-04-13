import type { Player } from "./player";

export type TeamPlayStyle =
  | "balanced"
  | "high_press"
  | "counter"
  | "possession"
  | "low_block";

export interface TeamTacticalProfile {
  default_style: TeamPlayStyle;
  press_intensity: 1 | 2 | 3 | 4 | 5;
  line_height: "low" | "mid" | "high";
  compactness: 1 | 2 | 3 | 4 | 5;
  transition_speed: 1 | 2 | 3 | 4 | 5;
}

export interface Team {
  id: string;
  user_id: string | null;
  name: string;
  created_at: string;
  players: Player[];
  tactical_profile?: TeamTacticalProfile;
}
