export interface Player {
  id: string;
  name: string;
  cumulative_score: number;
}

export interface Team {
  id: string;
  match_id: string;
  players: Player[];
  score: number;
}

export interface Match {
  id: string;
  round_id: string;
  teams: Team[];
  score: number; // derived
}

export interface Round {
  id: string;
  round_number: number;
  tournament_id: string;
  matches: Match[];
}

export interface Tournament {
  id: string;
  start_date: string; // ISO date
  status: string;
  rounds_count: number;
  rounds: Round[];
}

export interface MatchScore {
  match_id: string;
  team_ids: string[];
  team_scores: number[];
}