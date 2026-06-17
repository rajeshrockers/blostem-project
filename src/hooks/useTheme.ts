import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';
type Theme = 'light' | 'dark';

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  // Default to light if no preference saved
  return 'light';
}

// Manages the app's dark / light theme.
// - Reads the saved theme from localStorage on mount.
// - Toggles the `dark` class on <html> accordingly.
// - Exposes `theme` state and a `toggleTheme` function.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
