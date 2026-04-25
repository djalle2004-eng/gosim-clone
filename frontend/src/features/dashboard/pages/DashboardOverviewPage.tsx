import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Smartphone,
  Database,
  Star,
  Plus,
  RefreshCw,
  Users,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Wifi,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayed(end);
        clearInterval(timer);
      } else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {prefix}
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  PAID: { label: 'مدفوع', icon: CheckCircle2, color: 'text-emerald-500' },
  PENDING: { label: 'معلق', icon: Clock, color: 'text-amber-500' },
  FAILED: { label: 'فاشل', icon: XCircle, color: 'text-red-500' },
  CANCELLED: { label: 'ملغى', icon: XCircle, color: 'text-slate-400' },
};

export default function DashboardOverviewPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const r = await api.get('/orders');
      return r.data;
    },
  });

  // ── Derived stats ────────────────────────────────────────────────────────────
  const paidOrders = orders.filter((o: any) => o.status === 'PAID');
  const totalSpent = paidOrders.reduce(
    (s: number, o: any) => s + (o.totalPrice || 0),
    0
  );
  const allESims = orders.flatMap((o: any) =>
    o.orderItems.flatMap((i: any) => i.assignedESims)
  );
  const activeESims = allESims.filter((e: any) => e.status === 'ACTIVE').length;
  const usedDataMB = allESims.reduce(
    (s: number, e: any) => s + (e.dataUsed || 0),
    0
  );
  const usedDataGB = (usedDataMB / 1024).toFixed(1);

  const recentESims = allESims.slice(0, 3);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'إجمالي الإنفاق',
      value: totalSpent,
      prefix: '$',
      icon: Wallet,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'eSIM النشطة',
      value: activeESims,
      icon: Smartphone,
      color: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-50',
    },
    {
      label: 'البيانات المستخدمة',
      value: parseFloat(usedDataGB),
      suffix: ' GB',
      icon: Database,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'نقاط المكافآت',
      value: Math.floor(totalSpent * 10),
      icon: Star,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
    },
  ];

  const quickActions = [
    {
      label: 'شراء eSIM جديد',
      icon: Plus,
      to: '/plans',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'تجديد خطة',
      icon: RefreshCw,
      to: '/dashboard/esims',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      label: 'دعوة صديق',
      icon: Users,
      to: '/dashboard/referral',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'تعبئة المحفظة',
      icon: CreditCard,
      to: '/dashboard/wallet',
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">لوحة التحكم</h1>
        <p className="text-slate-500">مرحباً بك، إليك ملخص حسابك.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
              <div
                className={`w-5 h-5 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center`}
              >
                <s.icon className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">
              <AnimatedNumber
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
              />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <Link
              to={a.to}
              className={`flex items-center gap-3 bg-gradient-to-l ${a.gradient} text-white rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}
            >
              <div className="bg-white/20 p-2 rounded-xl">
                <a.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">{a.label}</span>
              <ArrowUpRight className="w-4 h-4 mr-auto opacity-70" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active eSIMs mini-list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 text-lg">eSIM النشطة</h2>
            <Link
              to="/dashboard/esims"
              className="text-cyan-500 text-sm font-medium hover:text-cyan-600 flex items-center gap-1"
            >
              عرض الكل <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {recentESims.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Smartphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">لا توجد eSIM نشطة حالياً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentESims.map((e: any) => {
                const pct = e.dataTotal
                  ? Math.min(100, (e.dataUsed / e.dataTotal) * 100)
                  : 0;
                return (
                  <div
                    key={e.id}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-cyan-500" />
                        <span className="font-medium text-slate-700 text-sm">
                          {e.iccid?.slice(-8)}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
                      >
                        {e.status === 'ACTIVE' ? 'نشط' : e.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {(e.dataUsed / 1024).toFixed(1)} GB /{' '}
                      {(e.dataTotal / 1024).toFixed(1)} GB
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 text-lg">آخر الطلبات</h2>
            <Link
              to="/dashboard/orders"
              className="text-cyan-500 text-sm font-medium hover:text-cyan-600 flex items-center gap-1"
            >
              عرض الكل <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">لا توجد طلبات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o: any) => {
                const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.PENDING;
                const Icon = cfg.icon;
                return (
                  <div
                    key={o.id}
                    className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('ar-DZ')}
                      </p>
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      ${o.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
