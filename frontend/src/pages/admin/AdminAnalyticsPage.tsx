import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

// ─── Cohort Analysis Data ─────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const cohortData = MONTHS.slice(0, 6).map((month, i) => {
  const row: Record<string, any> = {
    month,
    users: Math.floor(Math.random() * 300 + 200),
  };
  for (let j = 0; j <= i; j++) {
    row[`m${j}`] =
      j === 0
        ? 100
        : Math.max(5, Math.round(100 - j * (15 + Math.random() * 8)));
  }
  return row;
});

// ─── Funnel Data ──────────────────────────────────────────────────────────────

const funnelData = [
  { name: 'Visitors', value: 48200, color: '#06b6d4' },
  { name: 'Signups', value: 12847, color: '#8b5cf6' },
  { name: 'First Purchase', value: 3291, color: '#f59e0b' },
  { name: 'Repeat Purchase', value: 1108, color: '#10b981' },
];

// ─── Revenue by Provider ──────────────────────────────────────────────────────

const providerRevenue = [
  { provider: 'Airalo', revenue: 24500, orders: 1842, color: '#06b6d4' },
  { provider: 'eSIMGO', revenue: 18200, orders: 1102, color: '#8b5cf6' },
  { provider: 'SoufSim Direct', revenue: 5700, orders: 347, color: '#10b981' },
];

// ─── LTV Distribution ─────────────────────────────────────────────────────────

const ltvData = [
  { range: '$0–10', users: 4200 },
  { range: '$10–25', users: 3100 },
  { range: '$25–50', users: 2800 },
  { range: '$50–100', users: 1500 },
  { range: '$100–200', users: 890 },
  { range: '$200+', users: 357 },
];

// ─── Geographic Revenue ───────────────────────────────────────────────────────

const geoData = [
  { country: 'Algeria', revenue: 18204, growth: 24, flag: '🇩🇿' },
  { country: 'France', revenue: 13102, growth: 12, flag: '🇫🇷' },
  { country: 'Saudi Arabia', revenue: 11870, growth: 31, flag: '🇸🇦' },
  { country: 'UAE', revenue: 9645, growth: 18, flag: '🇦🇪' },
  { country: 'Germany', revenue: 7424, growth: 8, flag: '🇩🇪' },
  { country: 'UK', revenue: 6830, growth: 15, flag: '🇬🇧' },
  { country: 'Morocco', revenue: 5120, growth: 42, flag: '🇲🇦' },
  { country: 'Tunisia', revenue: 3870, growth: 28, flag: '🇹🇳' },
];

// ─── Monthly trend ────────────────────────────────────────────────────────────

const monthlyTrend = MONTHS.map((m, i) => ({
  month: m,
  revenue: Math.round(20000 + i * 3500 + Math.random() * 4000),
  users: Math.round(800 + i * 120 + Math.random() * 200),
}));

// ─── Retention Heatmap Cell ───────────────────────────────────────────────────

function HeatCell({ value }: { value: number | undefined }) {
  if (value === undefined) return <td className="w-12 h-10" />;
  const bg =
    value >= 80
      ? 'bg-emerald-500 text-white'
      : value >= 60
        ? 'bg-emerald-200 text-emerald-900'
        : value >= 40
          ? 'bg-amber-200 text-amber-900'
          : value >= 20
            ? 'bg-orange-200 text-orange-900'
            : 'bg-red-200 text-red-900';
  return (
    <td className={`w-12 h-10 text-center text-xs font-bold rounded-lg ${bg}`}>
      {value}%
    </td>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cohort' | 'funnel' | 'geo'
  >('overview');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Analytics Center
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Deep insights into platform performance
          </p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(['overview', 'cohort', 'funnel', 'geo'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white shadow text-slate-800'
                  : 'text-slate-500'
              }`}
            >
              {tab === 'geo'
                ? 'Geographic'
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Trend */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Monthly Revenue & User Growth
            </h3>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: any, n: string) => [
                      n === 'revenue' ? `$${v.toLocaleString()}` : v,
                      n === 'revenue' ? 'Revenue' : 'Users',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#gRev)"
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provider breakdown + LTV */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 mb-4">
                Revenue by Provider
              </h3>
              <div className="space-y-4">
                {providerRevenue.map((p) => (
                  <div key={p.provider}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {p.provider}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800">
                          ${p.revenue.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          {p.orders} orders
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(p.revenue / providerRevenue[0].revenue) * 100}%`,
                          backgroundColor: p.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-48 mt-6" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={providerRevenue}
                      dataKey="revenue"
                      nameKey="provider"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {providerRevenue.map((p, i) => (
                        <Cell key={i} fill={p.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(v: any) => [
                        `$${v.toLocaleString()}`,
                        'Revenue',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LTV Distribution */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 mb-1">
                Customer LTV Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Lifetime value across all customers
              </p>
              <div className="h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ltvData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="range"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="users" name="Customers" radius={[6, 6, 0, 0]}>
                      {ltvData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={`hsl(${190 + idx * 15}, 70%, ${55 - idx * 3}%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COHORT ANALYSIS ── */}
      {activeTab === 'cohort' && (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-1">
            Cohort Retention Analysis
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Percentage of users from each signup cohort who returned in
            subsequent months.
            <span className="ml-2 text-emerald-600 font-medium">
              Dark green = high retention
            </span>
          </p>
          <div className="overflow-x-auto">
            <table className="text-sm border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left text-slate-500 font-medium px-2 py-1 w-20">
                    Cohort
                  </th>
                  <th className="text-slate-500 font-medium w-20">Users</th>
                  {MONTHS.slice(0, 7).map((m, i) => (
                    <th
                      key={m}
                      className="text-slate-400 font-medium w-12 text-center"
                    >
                      M+{i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row) => (
                  <tr key={row.month}>
                    <td className="text-sm font-bold text-slate-700 px-2 py-1">
                      {row.month}
                    </td>
                    <td className="text-center text-xs text-slate-500">
                      {row.users}
                    </td>
                    {Array.from({ length: 7 }, (_, j) => (
                      <HeatCell key={j} value={row[`m${j}`]} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <span>Retention scale:</span>
            {['80%+', '60–80%', '40–60%', '20–40%', '<20%'].map((label, i) => {
              const colors = [
                'bg-emerald-500',
                'bg-emerald-200',
                'bg-amber-200',
                'bg-orange-200',
                'bg-red-200',
              ];
              return (
                <span key={i} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded ${colors[i]}`} />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FUNNEL ── */}
      {activeTab === 'funnel' && (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-1">Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mb-8">
            Visitor to repeat buyer conversion rates
          </p>
          <div className="max-w-xl mx-auto space-y-4">
            {funnelData.map((stage, i) => {
              const pct = ((stage.value / funnelData[0].value) * 100).toFixed(
                1
              );
              const convRate =
                i > 0
                  ? ((stage.value / funnelData[i - 1].value) * 100).toFixed(1)
                  : '100';
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-bold text-slate-800">
                        {stage.name}
                      </span>
                      {i > 0 && (
                        <span className="ml-2 text-xs text-slate-400">
                          ↓ {convRate}% from prev
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-800">
                        {stage.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl overflow-hidden flex items-center">
                    <div
                      className="h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-3"
                      style={{ width: `${pct}%`, backgroundColor: stage.color }}
                    >
                      <span className="text-white text-xs font-bold">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              {
                label: 'Visit → Signup Rate',
                value: `${((funnelData[1].value / funnelData[0].value) * 100).toFixed(1)}%`,
                color: 'text-cyan-600',
              },
              {
                label: 'Signup → Purchase Rate',
                value: `${((funnelData[2].value / funnelData[1].value) * 100).toFixed(1)}%`,
                color: 'text-violet-600',
              },
              {
                label: 'Purchase → Repeat Rate',
                value: `${((funnelData[3].value / funnelData[2].value) * 100).toFixed(1)}%`,
                color: 'text-emerald-600',
              },
            ].map((m, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                <p className="text-xs text-slate-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GEOGRAPHIC ── */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Geographic Revenue Heatmap
            </h3>
            <div className="space-y-3">
              {geoData.map((g, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{g.flag}</span>
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-medium text-slate-700">
                      {g.country}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-7 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-end pr-2 transition-all duration-700"
                        style={{
                          width: `${(g.revenue / geoData[0].revenue) * 100}%`,
                        }}
                      >
                        <span className="text-white text-xs font-bold">
                          ${(g.revenue / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold w-14 text-right ${g.growth >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}
                  >
                    +{g.growth}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: 'Top Market',
                value: '🇩🇿 Algeria',
                sub: '$18,204 revenue',
              },
              {
                label: 'Fastest Growing',
                value: '🇲🇦 Morocco',
                sub: '+42% this month',
              },
              {
                label: 'Markets Active',
                value: '47 Countries',
                sub: 'Across 6 regions',
              },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-2xl p-5 text-center"
              >
                <p className="text-xl font-black text-slate-800">{c.value}</p>
                <p className="text-xs text-slate-400 mt-1">{c.label}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {c.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
