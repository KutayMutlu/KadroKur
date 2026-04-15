import type { Player } from "./player";

/** Persisted editor state (maps to DB `canvas_state` JSON) */
export interface CanvasState {
  teamName: string;
  /** Rakip takım adı (sahada rakip oyuncuları varken) */
  opponentTeamName?: string;
  formation_key: string;
  /** Rakip takım dizilişi (opsiyonel; yoksa `formation_key` ile aynı kabul edilir). */
  opponent_formation_key?: string;
  preset_key: string | null;
  /** Rakip takım preset'i (opsiyonel; yoksa "default"). */
  opponent_preset_key?: string | null;
  players: Player[];
  /**
   * true: atak ekseni görünümde ters (y ↔ 1−y). Kendi takım ve rakip aynı uzayda birlikte döner.
   * Yoksa / false: önceki varsayılan yön.
   */
  attack_flip?: boolean;
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
