import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Smartphone, ReceiptText, Wallet,
  Users, Settings, LogOut, ShieldCheck, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'نظرة عامة', path: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'eSIM الخاصة بي', path: '/dashboard/esims', icon: Smartphone },
  { label: 'طلباتي', path: '/dashboard/orders', icon: ReceiptText },
  { label: 'محفظتي', path: '/dashboard/wallet', icon: Wallet },
  { label: 'الإحالة', path: '/dashboard/referral', icon: Users },
  { label: 'الإعدادات', path: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* ── Mobile Header ─────────────────────────────────────────────────── */}
      <header className="md:hidden bg-white border-b border-slate-200/70 py-3 px-4 sticky top-0 z-50 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/soufsim-logo.png" alt="SoufSim" className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-400/40" />
          <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <img src="/soufsim-logo.png" alt="SoufSim" className="h-12 object-contain" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* User card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5">
              <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold text-slate-800 text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(item => (
                <NavLink key={item.path} to={item.path} end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent')}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium mt-2">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-l border-slate-200/70 h-screen sticky top-0 p-5 z-40 shadow-sm">
        <Link to="/" className="mb-8 block">
          <img src="/soufsim-logo.png" alt="SoufSim" className="h-14 w-auto object-contain drop-shadow" />
        </Link>

        {/* User Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt="" className="w-10 h-10 rounded-xl border border-cyan-300/40" />
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">
                {user.firstName} {user.lastName}
                {user.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-400 inline mr-1" />}
              </p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Admin Banner */}
        {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
          <Link to="/admin/dashboard"
            className="flex items-center gap-2 justify-center bg-violet-600/10 text-violet-600 border border-violet-200 px-4 py-2.5 rounded-xl text-sm font-bold mb-4 hover:bg-violet-600/20 transition-colors">
            <ShieldCheck className="w-4 h-4" /> لوحة تحكم الإدارة
          </Link>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-transparent'
              )}>
              {({ isActive }) => (
                <>
                  <div className={cn('p-1.5 rounded-lg', isActive ? 'bg-cyan-100' : 'bg-slate-100')}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2 text-sm font-medium">
          <div className="p-1.5 bg-red-50 rounded-lg"><LogOut className="w-3.5 h-3.5" /></div>
          تسجيل الخروج
        </button>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none" />
        <div className="relative z-10 p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Tab ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 flex z-50 px-2 pb-safe">
        {navItems.slice(0, 5).map(item => (
          <NavLink key={item.path} to={item.path} end={item.end}
            className={({ isActive }) => cn('flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium relative transition-colors',
              isActive ? 'text-cyan-600' : 'text-slate-400')}>
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-0 inset-x-2 h-0.5 bg-cyan-500 rounded-b-full" />}
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
