import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../shared/lib/queryClient';
import { useAuthStore } from '../features/auth/store/authStore';
import { AuthProvider } from '../context/AuthContext';

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const { isInitialized, refreshAuth } = useAuthStore();

  useEffect(() => {
    // If already hydrated from localStorage by zustand-persist, mark as initialized
    // and skip heavy network call (access token still in memory from persist).
    // Otherwise, attempt a silent refresh using the httpOnly cookie.
    if (!isInitialized) {
      refreshAuth().catch(() => {
        // ignore: user is just not logged in, isInitialized will be set to true inside refreshAuth()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
