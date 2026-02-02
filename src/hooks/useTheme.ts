import { useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme, setTheme };
};
