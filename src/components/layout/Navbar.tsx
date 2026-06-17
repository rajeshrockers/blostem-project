import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';
import { useCart } from '../../hooks/useCart';
import { SunIcon } from '../icons/SunIcon';
import { MoonIcon } from '../icons/MoonIcon';
import { CartIcon } from '../icons/CartIcon';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo — always visible */}
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm">
            Blostem
          </Link>

          {/* Right-side navigation links */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  Favorites
                </Link>
                <Link
                  to="/cart"
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Cart"
                >
                  <CartIcon count={totalItems} />
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
