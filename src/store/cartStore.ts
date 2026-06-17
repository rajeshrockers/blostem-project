import { create } from 'zustand';

export interface CartItem {
  id: number;
  quantity: number;
}

function getCartKey(userId: number | null): string {
  return userId ? `cart_user_${userId}` : 'cart';
}

function readCart(userId: number | null): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(getCartKey(userId)) || '[]');
  } catch {
    return [];
  }
}

function writeCart(userId: number | null, items: CartItem[]) {
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
}

interface CartState {
  items: CartItem[];
  add: (id: number, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  isInCart: (id: number) => boolean;
  getQuantity: (id: number) => number;
  totalItems: () => number;
  loadForUser: (userId: number | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: readCart(null),

  add: (id, quantity = 1) => {
    const current = get().items;
    const existing = current.find((item) => item.id === id);
    let updated: CartItem[];
    if (existing) {
      updated = current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...current, { id, quantity }];
    }
    // userId is read from authStore at call time
    const userId = (JSON.parse(localStorage.getItem('userId') || 'null') as number | null);
    writeCart(userId, updated);
    set({ items: updated });
  },

  updateQuantity: (id, quantity) => {
    const current = get().items;
    let updated: CartItem[];
    if (quantity <= 0) {
      updated = current.filter((item) => item.id !== id);
    } else {
      updated = current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    }
    const userId = (JSON.parse(localStorage.getItem('userId') || 'null') as number | null);
    writeCart(userId, updated);
    set({ items: updated });
  },

  remove: (id) => {
    const current = get().items;
    const updated = current.filter((item) => item.id !== id);
    const userId = (JSON.parse(localStorage.getItem('userId') || 'null') as number | null);
    writeCart(userId, updated);
    set({ items: updated });
  },

  clear: () => {
    const userId = (JSON.parse(localStorage.getItem('userId') || 'null') as number | null);
    writeCart(userId, []);
    set({ items: [] });
  },

  isInCart: (id) => get().items.some((item) => item.id === id),

  getQuantity: (id) => get().items.find((item) => item.id === id)?.quantity || 0,

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  loadForUser: (userId) => {
    set({ items: readCart(userId) });
  },
}));
