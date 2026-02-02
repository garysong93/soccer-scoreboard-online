import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MatchState, Team, MatchEvent, MatchPeriod, MatchStats } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createDefaultTeam = (name: string, shortName: string, color: string): Team => ({
  name,
  shortName,
  color,
  score: 0,
  yellowCards: 0,
  redCards: 0,
});

const createDefaultStats = (): MatchStats => ({
  possession: { home: 50, away: 50 },
  corners: { home: 0, away: 0 },
  fouls: { home: 0, away: 0 },
  offsides: { home: 0, away: 0 },
  shots: { home: 0, away: 0 },
  shotsOnTarget: { home: 0, away: 0 },
});

const createNewMatch = (): MatchState => ({
  id: generateId(),
  home: createDefaultTeam('Home Team', 'HOME', '#ef4444'),
  away: createDefaultTeam('Away Team', 'AWAY', '#22c55e'),
  homePlayers: [],
  awayPlayers: [],
  events: [],
  period: 'not_started',
  timerSeconds: 0,
  addedTime: 0,
  isTimerRunning: false,
  stats: createDefaultStats(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

interface GameState {
  match: MatchState;
  history: MatchState[];
  historyIndex: number;

  // Score actions
  addGoal: (team: 'home' | 'away') => void;
  removeGoal: (team: 'home' | 'away') => void;

  // Card actions
  addYellowCard: (team: 'home' | 'away') => void;
  removeYellowCard: (team: 'home' | 'away') => void;
  addRedCard: (team: 'home' | 'away') => void;
  removeRedCard: (team: 'home' | 'away') => void;

  // Timer actions
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  incrementTimer: () => void;
  setAddedTime: (minutes: number) => void;

  // Period actions
  setPeriod: (period: MatchPeriod) => void;
  nextPeriod: () => void;

  // Team actions
  setTeamName: (team: 'home' | 'away', name: string) => void;
  setTeamShortName: (team: 'home' | 'away', shortName: string) => void;
  setTeamColor: (team: 'home' | 'away', color: string) => void;

  // Stats actions
  updateStat: (stat: keyof MatchStats, team: 'home' | 'away', delta: number) => void;

  // Match actions
  resetMatch: () => void;
  newMatch: () => void;
  loadMatch: (match: MatchState) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Event tracking
  addEvent: (event: Omit<MatchEvent, 'id' | 'timestamp'>) => void;
}

const MAX_HISTORY = 50;

const saveToHistory = (state: GameState): MatchState[] => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.match)));
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }
  return newHistory;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      match: createNewMatch(),
      history: [],
      historyIndex: -1,

      addGoal: (team) => set((state) => {
        const newHistory = saveToHistory(state);
        const minute = Math.floor(state.match.timerSeconds / 60);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], score: state.match[team].score + 1 },
            events: [...state.match.events, {
              id: generateId(),
              type: 'goal',
              team,
              minute,
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      removeGoal: (team) => set((state) => {
        if (state.match[team].score <= 0) return state;
        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], score: state.match[team].score - 1 },
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      addYellowCard: (team) => set((state) => {
        const newHistory = saveToHistory(state);
        const minute = Math.floor(state.match.timerSeconds / 60);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], yellowCards: state.match[team].yellowCards + 1 },
            events: [...state.match.events, {
              id: generateId(),
              type: 'yellow_card',
              team,
              minute,
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      removeYellowCard: (team) => set((state) => {
        if (state.match[team].yellowCards <= 0) return state;
        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], yellowCards: state.match[team].yellowCards - 1 },
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      addRedCard: (team) => set((state) => {
        const newHistory = saveToHistory(state);
        const minute = Math.floor(state.match.timerSeconds / 60);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], redCards: state.match[team].redCards + 1 },
            events: [...state.match.events, {
              id: generateId(),
              type: 'red_card',
              team,
              minute,
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      removeRedCard: (team) => set((state) => {
        if (state.match[team].redCards <= 0) return state;
        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            [team]: { ...state.match[team], redCards: state.match[team].redCards - 1 },
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      setTimerRunning: (running) => set((state) => ({
        match: { ...state.match, isTimerRunning: running, updatedAt: Date.now() },
      })),

      setTimerSeconds: (seconds) => set((state) => ({
        match: { ...state.match, timerSeconds: seconds, updatedAt: Date.now() },
      })),

      incrementTimer: () => set((state) => ({
        match: { ...state.match, timerSeconds: state.match.timerSeconds + 1 },
      })),

      setAddedTime: (minutes) => set((state) => ({
        match: { ...state.match, addedTime: minutes, updatedAt: Date.now() },
      })),

      setPeriod: (period) => set((state) => {
        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            period,
            events: [...state.match.events, {
              id: generateId(),
              type: period.includes('half') || period === 'extra_time_1' || period === 'extra_time_2'
                ? 'period_start'
                : 'period_end',
              team: 'home',
              minute: Math.floor(state.match.timerSeconds / 60),
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      nextPeriod: () => set((state) => {
        const periodOrder: MatchPeriod[] = [
          'not_started', 'first_half', 'half_time', 'second_half', 'finished'
        ];
        const currentIndex = periodOrder.indexOf(state.match.period);
        const nextPeriod = periodOrder[Math.min(currentIndex + 1, periodOrder.length - 1)];

        let timerSeconds = state.match.timerSeconds;
        if (nextPeriod === 'second_half') {
          timerSeconds = 45 * 60;
        } else if (nextPeriod === 'first_half') {
          timerSeconds = 0;
        }

        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            period: nextPeriod,
            timerSeconds,
            addedTime: 0,
            isTimerRunning: false,
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      setTeamName: (team, name) => set((state) => ({
        match: {
          ...state.match,
          [team]: { ...state.match[team], name },
          updatedAt: Date.now(),
        },
      })),

      setTeamShortName: (team, shortName) => set((state) => ({
        match: {
          ...state.match,
          [team]: { ...state.match[team], shortName },
          updatedAt: Date.now(),
        },
      })),

      setTeamColor: (team, color) => set((state) => ({
        match: {
          ...state.match,
          [team]: { ...state.match[team], color },
          updatedAt: Date.now(),
        },
      })),

      updateStat: (stat, team, delta) => set((state) => {
        const currentValue = state.match.stats[stat][team];
        const newValue = Math.max(0, currentValue + delta);

        if (stat === 'possession') {
          const otherTeam = team === 'home' ? 'away' : 'home';
          const otherValue = 100 - newValue;
          return {
            match: {
              ...state.match,
              stats: {
                ...state.match.stats,
                possession: {
                  [team]: Math.min(100, Math.max(0, newValue)),
                  [otherTeam]: Math.min(100, Math.max(0, otherValue)),
                } as { home: number; away: number },
              },
              updatedAt: Date.now(),
            },
          };
        }

        return {
          match: {
            ...state.match,
            stats: {
              ...state.match.stats,
              [stat]: {
                ...state.match.stats[stat],
                [team]: newValue,
              },
            },
            updatedAt: Date.now(),
          },
        };
      }),

      resetMatch: () => set((state) => {
        const newHistory = saveToHistory(state);
        return {
          match: {
            ...state.match,
            home: { ...state.match.home, score: 0, yellowCards: 0, redCards: 0 },
            away: { ...state.match.away, score: 0, yellowCards: 0, redCards: 0 },
            events: [],
            period: 'not_started',
            timerSeconds: 0,
            addedTime: 0,
            isTimerRunning: false,
            stats: createDefaultStats(),
            updatedAt: Date.now(),
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),

      newMatch: () => set(() => ({
        match: createNewMatch(),
        history: [],
        historyIndex: -1,
      })),

      loadMatch: (match: MatchState) => set(() => ({
        match: JSON.parse(JSON.stringify(match)),
        history: [],
        historyIndex: -1,
      })),

      undo: () => set((state) => {
        if (state.historyIndex < 0) return state;
        const previousMatch = state.history[state.historyIndex];
        return {
          match: previousMatch,
          historyIndex: state.historyIndex - 1,
        };
      }),

      redo: () => set((state) => {
        if (state.historyIndex >= state.history.length - 1) return state;
        const nextMatch = state.history[state.historyIndex + 2];
        if (!nextMatch) return state;
        return {
          match: nextMatch,
          historyIndex: state.historyIndex + 1,
        };
      }),

      canUndo: () => get().historyIndex >= 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      addEvent: (event) => set((state) => ({
        match: {
          ...state.match,
          events: [...state.match.events, {
            ...event,
            id: generateId(),
            timestamp: Date.now(),
          }],
          updatedAt: Date.now(),
        },
      })),
    }),
    {
      name: 'soccer-scoreboard-game',
      partialize: (state) => ({
        match: state.match,
      }),
    }
  )
);
