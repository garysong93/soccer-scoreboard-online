import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsState extends Settings {
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (language: 'en' | 'zh' | 'es') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVoiceControlEnabled: (enabled: boolean) => void;
  setPeriodDuration: (minutes: number) => void;
  setExtraTimeDuration: (minutes: number) => void;
  setShowStats: (show: boolean) => void;
  setAutoSaveHistory: (enabled: boolean) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      soundEnabled: true,
      voiceControlEnabled: false,
      periodDuration: 45,
      extraTimeDuration: 15,
      showStats: true,
      autoSaveHistory: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVoiceControlEnabled: (voiceControlEnabled) => set({ voiceControlEnabled }),
      setPeriodDuration: (periodDuration) => set({ periodDuration }),
      setExtraTimeDuration: (extraTimeDuration) => set({ extraTimeDuration }),
      setShowStats: (showStats) => set({ showStats }),
      setAutoSaveHistory: (autoSaveHistory) => set({ autoSaveHistory }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'soccer-scoreboard-settings',
    }
  )
);
