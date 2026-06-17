import { create } from 'zustand';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: number | null;
  setToken: (token: string, refreshToken: string, userId?: number) => void;
  updateAccessToken: (token: string) => void;
  clearToken: () => void;
}

const storedUserId = localStorage.getItem('userId');

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  userId: storedUserId ? parseInt(storedUserId, 10) : null,
  setToken: (token, refreshToken, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    if (userId !== undefined) {
      localStorage.setItem('userId', String(userId));
    }
    set({ token, refreshToken, userId: userId ?? null });
  },
  updateAccessToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    set({ token: null, refreshToken: null, userId: null });
  },
}));
