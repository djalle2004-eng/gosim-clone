import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Smartphone,
  ShoppingCart,
  Activity,
  Bell,
  LogOut,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Real app: if(!isAdmin) return <Navigate to="/login" />

  const navItems = [
    {
      label: 'نظرة عامة',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'إدارة الباقات',
      path: '/admin/plans',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: 'الطلبات والمالية',
      path: '/admin/orders',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: 'المستخدمون',
      path: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'مراقبة الـ eSIMs',
      path: '/admin/esims',
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Add Super Admin only items
  if (isSuperAdmin) {
    navItems.push({
      label: 'إدارة الدول',
      path: '/admin/countries',
      icon: <Globe className="w-5 h-5" />,
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {' '}
      {/* Extra dark background for Admin panel */}
      {/* Sidebar fixed */}
      <aside className="w-72 border-l border-white/5 bg-[#12121a] flex flex-col h-screen sticky top-0 z-50">
        <div className="h-20 px-6 flex items-center border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/soufsim-logo.png"
              alt="SoufSim Logo"
              className="h-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-[0.2em] mt-1 text-right">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
            القائمة الرئيسية
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'transition-transform group-hover:scale-110',
                      isActive && 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#12121a]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <input
              type="text"
              placeholder="ابحث عن مستخدم، طلب، أو باقة..."
              className="w-96 bg-background border border-white/5 rounded-full px-6 py-2.5 outline-none text-white focus:border-cyan-500/50 transition-colors text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-card shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/5"
              >
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-white">المدير العام</p>
                  <p className="text-xs text-gray-500">admin@soufsim.dz</p>
                </div>
                <img
                  src="https://i.pravatar.cc/150?u=admin"
                  className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
                />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {/* Dropdown would go here */}
            </div>
          </div>
        </header>

        {/* Dashboard Page Content Outlets */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
