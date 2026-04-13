import type { FormationDefinition } from "@/types/formation";

export type MatchFormatKey =
  | "5v5"
  | "6v6"
  | "7v7"
  | "8v8"
  | "9v9"
  | "10v10"
  | "11v11";

export const MATCH_FORMATS: Array<{
  key: MatchFormatKey;
  label: string;
  teamSize: number;
}> = [
  { key: "5v5", label: "5 Kişilik", teamSize: 5 },
  { key: "6v6", label: "6 Kişilik", teamSize: 6 },
  { key: "7v7", label: "7 Kişilik", teamSize: 7 },
  { key: "8v8", label: "8 Kişilik", teamSize: 8 },
  { key: "9v9", label: "9 Kişilik", teamSize: 9 },
  { key: "10v10", label: "10 Kişilik", teamSize: 10 },
  { key: "11v11", label: "11 Kişilik", teamSize: 11 },
];

/** Normalized coordinates on pitch (0–1). Y increases downward (attack direction toward bottom). */
export const FORMATIONS: FormationDefinition[] = [
  {
    key: "2-1-1",
    title: "2-1-1",
    teamSize: 5,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.3, y: 0.26 },
      { x: 0.7, y: 0.26 },
      { x: 0.5, y: 0.48 },
      { x: 0.5, y: 0.72 },
    ],
  },
  {
    key: "1-2-1",
    title: "1-2-1",
    teamSize: 5,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.5, y: 0.26 },
      { x: 0.32, y: 0.48 },
      { x: 0.68, y: 0.48 },
      { x: 0.5, y: 0.72 },
    ],
  },
  {
    key: "2-2-1",
    title: "2-2-1",
    teamSize: 6,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.3, y: 0.24 },
      { x: 0.7, y: 0.24 },
      { x: 0.32, y: 0.5 },
      { x: 0.68, y: 0.5 },
      { x: 0.5, y: 0.74 },
    ],
  },
  {
    key: "3-1-1",
    title: "3-1-1",
    teamSize: 6,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.22, y: 0.24 },
      { x: 0.5, y: 0.24 },
      { x: 0.78, y: 0.24 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.74 },
    ],
  },
  {
    key: "2-3-1",
    title: "2-3-1",
    teamSize: 7,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.35, y: 0.22 },
      { x: 0.65, y: 0.22 },
      { x: 0.2, y: 0.45 },
      { x: 0.5, y: 0.45 },
      { x: 0.8, y: 0.45 },
      { x: 0.5, y: 0.72 },
    ],
  },
  {
    key: "3-2-1",
    title: "3-2-1",
    teamSize: 7,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.25, y: 0.24 },
      { x: 0.5, y: 0.24 },
      { x: 0.75, y: 0.24 },
      { x: 0.38, y: 0.48 },
      { x: 0.62, y: 0.48 },
      { x: 0.5, y: 0.72 },
    ],
  },
  {
    key: "2-2-2",
    title: "2-2-2",
    teamSize: 7,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.32, y: 0.26 },
      { x: 0.68, y: 0.26 },
      { x: 0.32, y: 0.48 },
      { x: 0.68, y: 0.48 },
      { x: 0.32, y: 0.7 },
      { x: 0.68, y: 0.7 },
    ],
  },
  {
    key: "3-3",
    title: "3-3",
    teamSize: 7,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.22, y: 0.28 },
      { x: 0.5, y: 0.28 },
      { x: 0.78, y: 0.28 },
      { x: 0.22, y: 0.52 },
      { x: 0.5, y: 0.52 },
      { x: 0.78, y: 0.52 },
    ],
  },
  {
    key: "3-2-2",
    title: "3-2-2",
    teamSize: 8,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.22, y: 0.24 },
      { x: 0.5, y: 0.24 },
      { x: 0.78, y: 0.24 },
      { x: 0.35, y: 0.46 },
      { x: 0.65, y: 0.46 },
      { x: 0.35, y: 0.7 },
      { x: 0.65, y: 0.7 },
    ],
  },
  {
    key: "2-3-2",
    title: "2-3-2",
    teamSize: 8,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.32, y: 0.24 },
      { x: 0.68, y: 0.24 },
      { x: 0.2, y: 0.46 },
      { x: 0.5, y: 0.46 },
      { x: 0.8, y: 0.46 },
      { x: 0.38, y: 0.7 },
      { x: 0.62, y: 0.7 },
    ],
  },
  {
    key: "3-3-2",
    title: "3-3-2",
    teamSize: 9,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.22, y: 0.24 },
      { x: 0.5, y: 0.24 },
      { x: 0.78, y: 0.24 },
      { x: 0.22, y: 0.46 },
      { x: 0.5, y: 0.46 },
      { x: 0.78, y: 0.46 },
      { x: 0.38, y: 0.7 },
      { x: 0.62, y: 0.7 },
    ],
  },
  {
    key: "4-2-2",
    title: "4-2-2",
    teamSize: 9,
    player_positions: [
      { x: 0.5, y: 0.08 },
      { x: 0.14, y: 0.24 },
      { x: 0.38, y: 0.24 },
      { x: 0.62, y: 0.24 },
      { x: 0.86, y: 0.24 },
      { x: 0.38, y: 0.48 },
      { x: 0.62, y: 0.48 },
      { x: 0.35, y: 0.72 },
      { x: 0.65, y: 0.72 },
    ],
  },
  {
    key: "4-3-2",
    title: "4-3-2",
    teamSize: 10,
    player_positions: [
      { x: 0.5, y: 0.07 },
      { x: 0.15, y: 0.22 },
      { x: 0.38, y: 0.22 },
      { x: 0.62, y: 0.22 },
      { x: 0.85, y: 0.22 },
      { x: 0.28, y: 0.44 },
      { x: 0.5, y: 0.44 },
      { x: 0.72, y: 0.44 },
      { x: 0.4, y: 0.68 },
      { x: 0.6, y: 0.68 },
    ],
  },
  {
    key: "3-4-2",
    title: "3-4-2",
    teamSize: 10,
    player_positions: [
      { x: 0.5, y: 0.07 },
      { x: 0.22, y: 0.22 },
      { x: 0.5, y: 0.22 },
      { x: 0.78, y: 0.22 },
      { x: 0.12, y: 0.44 },
      { x: 0.37, y: 0.44 },
      { x: 0.63, y: 0.44 },
      { x: 0.88, y: 0.44 },
      { x: 0.4, y: 0.68 },
      { x: 0.6, y: 0.68 },
    ],
  },
  {
    key: "4-4-2",
    title: "4-4-2",
    teamSize: 11,
    player_positions: [
      { x: 0.5, y: 0.06 },
      { x: 0.12, y: 0.2 },
      { x: 0.37, y: 0.2 },
      { x: 0.63, y: 0.2 },
      { x: 0.88, y: 0.2 },
      { x: 0.12, y: 0.38 },
      { x: 0.37, y: 0.38 },
      { x: 0.63, y: 0.38 },
      { x: 0.88, y: 0.38 },
      { x: 0.4, y: 0.58 },
      { x: 0.6, y: 0.58 },
    ],
  },
  {
    key: "4-3-3",
    title: "4-3-3",
    teamSize: 11,
    player_positions: [
      { x: 0.5, y: 0.06 },
      { x: 0.12, y: 0.2 },
      { x: 0.37, y: 0.2 },
      { x: 0.63, y: 0.2 },
      { x: 0.88, y: 0.2 },
      { x: 0.3, y: 0.4 },
      { x: 0.5, y: 0.4 },
      { x: 0.7, y: 0.4 },
      { x: 0.25, y: 0.62 },
      { x: 0.5, y: 0.62 },
      { x: 0.75, y: 0.62 },
    ],
  },
];

export function getFormationByKey(key: string): FormationDefinition | undefined {
  return FORMATIONS.find((f) => f.key === key);
}

export function getFormationsByFormat(format: MatchFormatKey): FormationDefinition[] {
  const selected = MATCH_FORMATS.find((f) => f.key === format);
  if (!selected) return [];
  return FORMATIONS.filter((f) => f.teamSize === selected.teamSize);
}

export function getMatchFormatForFormation(
  formationKey: string
): MatchFormatKey | undefined {
  const formation = getFormationByKey(formationKey);
  if (!formation) return undefined;
  return MATCH_FORMATS.find((f) => f.teamSize === formation.teamSize)?.key;
}
