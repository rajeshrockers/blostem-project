import { create } from 'zustand';

const THEME_KEY = 'theme';
type Theme = 'light' | 'dark';

const stored = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initialTheme: Theme = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : prefersDark ? 'dark' : 'light';

// Apply the initial theme class before React renders to avoid a flash.
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// Global theme store. Syncs the `dark` class on <html> and persists to localStorage.
export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      const root = document.documentElement;
      if (next === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem(THEME_KEY, next);
      return { theme: next };
    }),
}));
