import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // ← NEW: true once refresh has been attempted
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,

      login: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isInitialized: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isInitialized: true,
        }),

      refreshAuth: async () => {
        try {
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const { accessToken, user } = response.data;
          if (user && accessToken) {
            set({
              accessToken,
              user,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            // tokens refreshed via cookie-only, try getCurrentUser
            const meRes = await axios.get(`${baseURL}/auth/me`, {
              headers: accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {},
              withCredentials: true,
            });
            set({
              accessToken,
              user: meRes.data,
              isAuthenticated: true,
              isInitialized: true,
            });
          }
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'gosim-auth',
      // Only persist user data and token to localStorage for faster hydration
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
