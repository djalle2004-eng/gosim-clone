import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../shared/lib/queryClient';
import { useAuthStore } from '../features/auth/store/authStore';
import { AuthProvider } from '../context/AuthContext';

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  useEffect(() => {
    // Attempt to silently refresh token on app load if we have an httpOnly cookie
    refreshAuth().catch(() => {
      // ignore, user is just not logged in
    });
  }, [refreshAuth]);

  return <>{children}</>;
};

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthInitializer>
          {children}
          <Toaster position="top-right" />
        </AuthInitializer>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
