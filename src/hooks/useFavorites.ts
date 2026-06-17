import { useCallback, useState } from 'react';
import { useAuthStore } from '../store/authStore';

// Returns a user-scoped localStorage key for favorites.
function getFavoritesKey(userId: number | null): string {
  return userId ? `favorites_user_${userId}` : 'favorites';
}

function readFavorites(userId: number | null): number[] {
  try {
    return JSON.parse(localStorage.getItem(getFavoritesKey(userId)) || '[]');
  } catch {
    return [];
  }
}

// Hook for user-scoped favorites. Each logged-in user gets their own localStorage key.
export function useFavorites() {
  const userId = useAuthStore((state) => state.userId);
  const [favorites, setFavoritesState] = useState<number[]>(readFavorites(userId));

  const refresh = useCallback(() => {
    setFavoritesState(readFavorites(userId));
  }, [userId]);

  const toggle = useCallback(
    (id: number) => {
      const current = readFavorites(userId);
      const isFav = current.includes(id);
      const updated = isFav ? current.filter((f) => f !== id) : [...current, id];
      localStorage.setItem(getFavoritesKey(userId), JSON.stringify(updated));
      setFavoritesState(updated);
      return !isFav;
    },
    [userId]
  );

  const remove = useCallback(
    (id: number) => {
      const current = readFavorites(userId);
      const updated = current.filter((f) => f !== id);
      localStorage.setItem(getFavoritesKey(userId), JSON.stringify(updated));
      setFavoritesState(updated);
    },
    [userId]
  );

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggle, remove, isFavorite, refresh };
}
