import { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Activity,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const generate90Days = () => {
  const data = [];
  const base = new Date('2024-01-01');
  let prev = 3000;
  for (let i = 0; i < 90; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const current = Math.max(500, prev + (Math.random() - 0.42) * 800);
    const previous = Math.max(400, current * (0.75 + Math.random() * 0.3));
    prev = current;
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(current),
      previous: Math.round(previous),
    });
  }
  return data;
};

const revenueData = generate90Days();

const sparkData = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    v: Math.max(
      10,
      Math.round(
        seed + Math.sin(i + seed) * seed * 0.3 + Math.random() * seed * 0.2
      )
    ),
  }));

const KPIs = [
  {
    label: 'Monthly Revenue (MRR)',
    value: '$48,392',
    change: '+12.4%',
    isPositive: true,
    sub: 'vs $43,054 last month',
    icon: DollarSign,
    color: 'emerald',
    spark: sparkData(300),
    sparkColor: '#10b981',
  },
  {
    label: 'Total Users',
    value: '12,847',
    change: '+8.1%',
    isPositive: true,
    sub: '+312 this week',
    icon: Users,
    color: 'violet',
    spark: sparkData(200),
    sparkColor: '#8b5cf6',
  },
  {
    label: 'Total Orders',
    value: '3,291',
    change: '+5.7%',
    isPositive: true,
    sub: '47 today',
    icon: ShoppingBag,
    color: 'cyan',
    spark: sparkData(150),
    sparkColor: '#06b6d4',
  },
  {
    label: 'Active eSIMs',
    value: '8,154',
    change: '+24.3%',
    isPositive: true,
    sub: '892 activated this week',
    icon: Activity,
    color: 'amber',
    spark: sparkData(400),
    sparkColor: '#f59e0b',
  },
  {
    label: 'Payment Success Rate',
    value: '97.3%',
    change: '-0.4%',
    isPositive: false,
    sub: '14 failures today',
    icon: CreditCard,
    color: 'red',
    spark: sparkData(90),
    sparkColor: '#ef4444',
  },
  {
    label: 'Avg. Order Value (AOV)',
    value: '$14.70',
    change: '+3.2%',
    isPositive: true,
    sub: 'vs $14.24 last month',
    icon: TrendingUp,
    color: 'sky',
    spark: sparkData(120),
    sparkColor: '#38bdf8',
  },
];

const topPlans = [
  {
    name: 'Europe 10GB 30 Days',
    orders: 842,
    revenue: '$12,360',
    growth: '+18%',
  },
  { name: 'Global 5GB 15 Days', orders: 631, revenue: '$8,812', growth: '+9%' },
  { name: 'Asia 3GB 7 Days', orders: 519, revenue: '$5,710', growth: '+22%' },
  { name: 'USA 1GB Unlimited', orders: 410, revenue: '$4,100', growth: '-3%' },
  { name: 'MENA 2GB 14 Days', orders: 384, revenue: '$3,456', growth: '+11%' },
];

const topCountries = [
  { country: 'Algeria', flag: '🇩🇿', orders: 1241, revenue: '$18,204' },
  { country: 'France', flag: '🇫🇷', orders: 892, revenue: '$13,102' },
  { country: 'Saudi Arabia', flag: '🇸🇦', orders: 741, revenue: '$11,870' },
  { country: 'UAE', flag: '🇦🇪', orders: 603, revenue: '$9,645' },
  { country: 'Germany', flag: '🇩🇪', orders: 512, revenue: '$7,424' },
];

const recentTransactions = [
  {
    id: '#TXN-9821',
    user: 'Ahmed Bensalem',
    plan: 'Europe 10GB',
    amount: '$14.99',
    status: 'success',
    time: '2m ago',
  },
  {
    id: '#TXN-9820',
    user: 'Sarah Dupont',
    plan: 'Asia 3GB',
    amount: '$9.99',
    status: 'success',
    time: '5m ago',
  },
  {
    id: '#TXN-9819',
    user: 'Mohammed Al-Rashid',
    plan: 'Global 5GB',
    amount: '$12.99',
    status: 'failed',
    time: '8m ago',
  },
  {
    id: '#TXN-9818',
    user: 'Yasmine Cherif',
    plan: 'USA Unlimited',
    amount: '$10.00',
    status: 'success',
    time: '12m ago',
  },
  {
    id: '#TXN-9817',
    user: 'Carlos Ruiz',
    plan: 'MENA 2GB',
    amount: '$8.99',
    status: 'pending',
    time: '15m ago',
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl p-3 shadow-2xl text-sm">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-bold">
            {p.name === 'revenue' ? 'Current' : 'Previous'}: $
            {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: (typeof KPIs)[0] }) {
  const Icon = kpi.icon;
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-${kpi.color}-50`}>
          <Icon className={`w-5 h-5 text-${kpi.color}-500`} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-sm font-bold ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}
        >
          {kpi.isPositive ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {kpi.change}
        </span>
      </div>
      <div className="text-2xl font-black text-slate-800 mb-0.5">
        {kpi.value}
      </div>
      <div className="text-xs text-slate-400 mb-3">{kpi.label}</div>
      {/* Sparkline */}
      <div className="h-10" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kpi.spark}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={kpi.sparkColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-slate-400 mt-1">{kpi.sub}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'7' | '30' | '90'>('90');
  const [refreshing, setRefreshing] = useState(false);

  const displayData =
    period === '7'
      ? revenueData.slice(-7)
      : period === '30'
        ? revenueData.slice(-30)
        : revenueData;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Command Center</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time performance overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </span>
          <button
            onClick={handleRefresh}
            className={`p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {KPIs.map((kpi, i) => (
          <KpiCard key={i} kpi={kpi} />
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Revenue Overview
            </h2>
            <p className="text-sm text-slate-400">
              Current period vs previous period
            </p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(['7', '30', '90'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${period === p ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >
                {p}D
              </button>
            ))}
          </div>
        </div>
        <div className="h-72" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(displayData.length / 8)}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#colorPrev)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#colorRev)"
                dot={false}
                activeDot={{ r: 5, fill: '#06b6d4' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom 3-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Plans */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">🔥 Top Plans</h3>
          <div className="space-y-3">
            {topPlans.map((plan, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {plan.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {plan.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-slate-800">
                    {plan.revenue}
                  </p>
                  <p
                    className={`text-xs font-medium ${plan.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {plan.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-5">
          <h3 className="font-bold text-slate-800 mb-4">🌍 Top Countries</h3>
          <div className="space-y-3">
            {topCountries.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {c.country}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {c.revenue}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      style={{
                        width: `${(c.orders / topCountries[0].orders) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">⚡ Recent Transactions</h3>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    tx.status === 'success'
                      ? 'bg-emerald-500'
                      : tx.status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {tx.user}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{tx.plan}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-800">
                    {tx.amount}
                  </p>
                  <p className="text-[10px] text-slate-400">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mini bar chart */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">
              Today's hourly transactions
            </p>
            <div className="h-16" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Array.from({ length: 12 }, (_, i) => ({
                    h: i * 2,
                    v: Math.round(Math.random() * 20 + 5),
                  }))}
                >
                  <Bar dataKey="v" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
