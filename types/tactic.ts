import type { Player } from "./player";

/** Persisted editor state (maps to DB `canvas_state` JSON) */
export interface CanvasState {
  teamName: string;
  formation_key: string;
  preset_key: string | null;
  players: Player[];
  pitchVersion: 1;
}

export interface Tactic {
  id: string;
  user_id: string | null;
  team_id: string | null;
  title: string;
  formation_key: string;
  preset_key: string | null;
  canvas_state: CanvasState;
  share_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
