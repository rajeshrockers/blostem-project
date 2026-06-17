import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { axiosInstance } from '../api/axiosInstance';
import { ENDPOINTS } from '../constants/endponint';
import type { User } from '../types';

// Validates the stored token by calling /auth/me.
// Returns auth state, user data, and a loading flag.
export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    // No token = not authenticated, skip the API call.
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Verify token is still valid with the server.
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get<User>(ENDPOINTS.AUTH.ME);
        setUser(data);
      } catch {
        // Token is invalid or expired — clear it.
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, clearToken]);

  return { isAuthenticated, user, loading };
}
