export type Language = 'en' | 'cn';

export type PlayerGender = 'M' | 'F';

export interface Player {
  id: string;
  name: string;
  nameCn?: string;
  gender: PlayerGender;
  avatar?: string;
}

export interface MatchPair {
  player1: string; // ID
  player2: string; // ID
}

export interface Match {
  id: string;
  court: string;
  team1: MatchPair;
  team2: MatchPair;
  time?: string;
}

export interface Round {
  id: string;
  nameEn: string;
  nameCn: string;
  time: string;
  matches: Match[];
}

export interface MatchScore {
  team1Games: number;
  team2Games: number;
}

export interface ScoreState {
  [matchId: string]: MatchScore;
}

export interface PlayerStats {
  id: string;
  name: string;
  nameCn?: string;
  gender: PlayerGender;
  avatar?: string;
  gamesWon: number;
  matchesPlayed: number;
}

export interface PlayoffScores {
  s1_t1: number; s1_t2: number;
  s2_t1: number; s2_t2: number;
  final_t1: number; final_t2: number;
  bronze_t1: number; bronze_t2: number;
}