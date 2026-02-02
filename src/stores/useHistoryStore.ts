import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameHistory, MatchState } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface HistoryState {
  savedMatches: GameHistory[];

  saveMatch: (match: MatchState) => void;
  deleteMatch: (id: string) => void;
  clearHistory: () => void;
  getMatch: (id: string) => GameHistory | undefined;
}

const MAX_SAVED_MATCHES = 50;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      savedMatches: [],

      saveMatch: (match) => set((state) => {
        const historyEntry: GameHistory = {
          id: generateId(),
          match: JSON.parse(JSON.stringify(match)),
          savedAt: Date.now(),
        };

        const newMatches = [historyEntry, ...state.savedMatches];
        if (newMatches.length > MAX_SAVED_MATCHES) {
          newMatches.pop();
        }

        return { savedMatches: newMatches };
      }),

      deleteMatch: (id) => set((state) => ({
        savedMatches: state.savedMatches.filter((m) => m.id !== id),
      })),

      clearHistory: () => set({ savedMatches: [] }),

      getMatch: (id) => get().savedMatches.find((m) => m.id === id),
    }),
    {
      name: 'soccer-scoreboard-history',
    }
  )
);
