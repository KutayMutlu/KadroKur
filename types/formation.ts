export interface FormationPosition {
  x: number;
  y: number;
}

export interface FormationDefinition {
  key: string;
  title: string;
  teamSize: number;
  player_positions: FormationPosition[];
}
