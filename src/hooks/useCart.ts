import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export type { CartItem } from '../store/cartStore';

export function useCart() {
  const userId = useAuthStore((state) => state.userId);

  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const loadForUser = useCartStore((state) => state.loadForUser);

  // Reload cart when user changes (login / logout).
  useEffect(() => {
    loadForUser(userId);
  }, [userId, loadForUser]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isInCart = (id: number) => items.some((item) => item.id === id);
  const getQuantity = (id: number) => items.find((item) => item.id === id)?.quantity || 0;

  return { items, add, updateQuantity, remove, clear, isInCart, getQuantity, totalItems };
}
