import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Wifi,
  ShoppingBag,
  Wallet,
} from 'lucide-react';

const generateChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      requests: Math.floor(Math.random() * 800) + 200,
      success: Math.floor(Math.random() * 700) + 180,
    });
  }
  return data;
};

const chartData = generateChartData();

const STAT_CARDS = [
  {
    label: 'Total Requests',
    value: '24,831',
    change: '+12.4%',
    up: true,
    icon: TrendingUp,
    color: 'cyan',
  },
  {
    label: 'Success Rate',
    value: '99.2%',
    change: '+0.3%',
    up: true,
    icon: CheckCircle,
    color: 'emerald',
  },
  {
    label: 'Avg Response',
    value: '142ms',
    change: '-8ms',
    up: true,
    icon: Clock,
    color: 'violet',
  },
  {
    label: 'Monthly Revenue',
    value: '$3,240',
    change: '+18%',
    up: true,
    icon: DollarSign,
    color: 'amber',
  },
];

const QUICK_STATS = [
  { label: 'Active eSIMs', value: '1,204', icon: Wifi },
  { label: 'Total Orders', value: '843', icon: ShoppingBag },
  { label: 'Wallet Balance', value: '$500.00', icon: Wallet },
];

const colorMap: Record<string, string> = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  emerald:
    'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
  violet:
    'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
};

export default function PartnerOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Partner Overview</h1>
        <p className="text-slate-400 mt-1">
          Welcome back. Here's what's happening with your API.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${colorMap[stat.color]} border rounded-2xl p-5`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <Icon className="w-5 h-5 opacity-70" />
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p
                className={`text-sm mt-1 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {stat.change}{' '}
                <span className="text-slate-500">vs last month</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">API Requests</h2>
            <p className="text-slate-400 text-sm">Last 30 days activity</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" />{' '}
              Total
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />{' '}
              Success
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e30',
                border: '1px solid #ffffff10',
                borderRadius: 12,
              }}
              labelStyle={{ color: '#94a3b8', fontSize: 12 }}
              itemStyle={{ color: '#e2e8f0', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorRequests)"
            />
            <Area
              type="monotone"
              dataKey="success"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorSuccess)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-[#111120] border border-white/5 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
