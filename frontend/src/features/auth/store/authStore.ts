import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  refreshAuth: async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
      const { accessToken, user } = response.data;
      set({ accessToken, user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, accessToken: null, isAuthenticated: false });
      throw error;
    }
  },
}));
