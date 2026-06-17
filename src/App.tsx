import { useEffect } from 'react';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';
import { useThemeStore } from './store/themeStore';
import { MAGIC_NUMBER } from './constants/constants';

function App() {
  const theme = useThemeStore((state) => state.theme);

  // Safety sync: ensure the <html> class always matches the store state.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
      <main id="main-content">
        <AppRoutes />
      </main>
      <Toaster position="top-right" richColors duration={MAGIC_NUMBER.ONE_THOUSAND} />
    </div>
  );
}

export default App
