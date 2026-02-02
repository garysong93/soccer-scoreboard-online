export interface Team {
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  score: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
  id: string;
  number: number;
  name: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  substitutedIn?: number;
  substitutedOut?: number;
}

// 球员名册（跨比赛持久化）
export interface RosterPlayer {
  id: string;
  number: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  teamId: string;
  createdAt: number;
}

// 球员生涯统计
export interface PlayerCareerStats {
  playerId: string;
  totalMatches: number;
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalMinutesPlayed: number;
  matchHistory: PlayerMatchRecord[];
}

// 单场比赛球员记录
export interface PlayerMatchRecord {
  matchId: string;
  matchDate: number;
  opponent: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

// 球队名册
export interface TeamRoster {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  players: RosterPlayer[];
  createdAt: number;
  updatedAt: number;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'period_start' | 'period_end';
  team: 'home' | 'away';
  playerId?: string;
  minute: number;
  addedTime?: number;
  description?: string;
  timestamp: number;
}

export type MatchPeriod =
  | 'not_started'
  | 'first_half'
  | 'half_time'
  | 'second_half'
  | 'extra_time_1'
  | 'extra_time_2'
  | 'penalties'
  | 'finished';

export interface MatchStats {
  possession: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
}

export interface MatchState {
  id: string;
  home: Team;
  away: Team;
  homePlayers: Player[];
  awayPlayers: Player[];
  events: MatchEvent[];
  period: MatchPeriod;
  timerSeconds: number;
  addedTime: number;
  isTimerRunning: boolean;
  stats: MatchStats;
  createdAt: number;
  updatedAt: number;
}

export interface GameHistory {
  id: string;
  match: MatchState;
  savedAt: number;
}

export interface Settings {
  theme: 'dark' | 'light';
  language: 'en' | 'zh' | 'es';
  soundEnabled: boolean;
  voiceControlEnabled: boolean;
  periodDuration: number;
  extraTimeDuration: number;
  showStats: boolean;
  autoSaveHistory: boolean;
}
