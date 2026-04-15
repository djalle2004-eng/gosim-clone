import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({
  requireAdmin = false,
}: {
  requireAdmin?: boolean;
}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 blur-[1px]"></div>
          <p className="text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
            جاري التحقق من الهوية...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in -> kick to login, capture current param so we can send them back after!
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not verified -> kick to OTP verification screen
  if (!user.isVerified) {
    return <Navigate to="/verify" replace />;
  }

  // Role guarding
  if (requireAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
