import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Smartphone,
  ReceiptText,
  UserCircle,
  Bell,
  LifeBuoy,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Should be handled by ProtectedRoute anyway

  const navItems = [
    {
      label: 'eSIM الخاصة بي',
      path: '/dashboard/esims',
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      label: 'طلباتي',
      path: '/dashboard/orders',
      icon: <ReceiptText className="w-5 h-5" />,
    },
    {
      label: 'الملف الشخصي',
      path: '/dashboard/profile',
      icon: <UserCircle className="w-5 h-5" />,
    },
    {
      label: 'الإشعارات',
      path: '/dashboard/notifications',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: 'الدعم',
      path: '/dashboard/support',
      icon: <LifeBuoy className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <header className="md:hidden bg-card border-b border-white/5 py-4 px-4 sticky top-0 z-50 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
            G
          </div>
          <span className="font-bold tracking-tight text-white">
            Go<span className="text-cyan-400">SIM</span>
          </span>
        </Link>
        <img
          src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-cyan-500/30"
        />
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-card border-l border-white/5 h-screen sticky top-0 p-6 z-40">
        <Link to="/" className="flex items-center gap-2 group mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            G
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Go<span className="text-cyan-400">SIM</span>
          </span>
        </Link>

        {/* User Card */}
        <div className="bg-background border border-white/5 rounded-2xl p-4 mb-8 flex items-center gap-4 relative overflow-hidden group">
          <img
            src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-cyan-500/30"
          />
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm flex items-center gap-1">
              {user.firstName} {user.lastName}
              {user.isVerified && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </h3>
            <p className="text-gray-500 text-xs truncate max-w-[120px]">
              {user.email}
            </p>
          </div>
          <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/20 rounded-2xl transition-colors pointer-events-none"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'transition-transform group-hover:scale-110',
                      isActive && 'text-cyan-400'
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.label}
                  {item.label === 'الإشعارات' && (
                    <span className="mr-auto w-5 h-5 bg-violet-600 text-white flex items-center justify-center rounded-full text-[10px] font-bold">
                      2
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-auto font-medium cursor-pointer"
        >
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto p-4 md:p-10 relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-white/5 flex px-2 pb-safe z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center py-3 gap-1 relative',
                isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 inset-x-4 h-1 bg-cyan-400 rounded-b-full"></div>
                )}
                <div className="relative">
                  {item.icon}
                  {item.label === 'الإشعارات' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600 border-2 border-card rounded-full"></span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
