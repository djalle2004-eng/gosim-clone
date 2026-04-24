import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../features/auth/store/authStore';
import { api } from '../shared/lib/axios';

export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'RESELLER'
  | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isVerified: boolean;
  phone?: string;
  discountRate?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    login: storeLogin,
    logout: storeLogout,
    refreshAuth,
  } = useAuthStore();

  const login = async (data: any) => {
    const res = await api.post('/auth/login', data);
    storeLogin(res.data.user, res.data.accessToken);
    return res.data.user;
  };

  const register = async (data: any) => {
    await api.post('/auth/register', data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      storeLogout();
      window.location.href = '/login';
    }
  };

  const checkAuth = async () => {
    try {
      await refreshAuth();
    } catch (error) {
      // already handled in store
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user as User | null,
        isLoading: false,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
