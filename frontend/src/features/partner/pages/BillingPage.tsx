import { ArrowUp, Download, Zap, Star, Building } from 'lucide-react';

const CURRENT_PLAN = {
  name: 'STARTER',
  tier: 'STARTER',
  dailyLimit: 1000,
  dailyUsed: 643,
  monthlyOrders: 500,
  monthlyOrdersUsed: 287,
  esimLimit: 200,
  esimUsed: 143,
};

const TIERS = [
  { name: 'FREE', price: '$0/mo', requests: '100 req/day', icon: Star, color: 'slate' },
  { name: 'STARTER', price: '$29/mo', requests: '1,000 req/day', icon: Zap, color: 'cyan', current: true },
  { name: 'PRO', price: '$99/mo', requests: '10,000 req/day', icon: ArrowUp, color: 'violet' },
  { name: 'ENTERPRISE', price: 'Custom', requests: '100,000 req/day', icon: Building, color: 'amber' },
];

const INVOICES = [
  { id: 'inv_001', date: 'Apr 2026', amount: '$29.00', status: 'Paid' },
  { id: 'inv_002', date: 'Mar 2026', amount: '$29.00', status: 'Paid' },
  { id: 'inv_003', date: 'Feb 2026', amount: '$29.00', status: 'Paid' },
];

function ProgressBar({ value, max, color = 'cyan' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500', violet: 'bg-violet-500', amber: 'bg-amber-500', red: 'bg-red-500'
  };
  const barColor = pct > 90 ? colorMap.red : colorMap[color];

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-white/5 rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-20 text-right">{value.toLocaleString()} / {max.toLocaleString()}</span>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="text-slate-400 mt-1">Monitor your API usage limits and manage your subscription.</p>
      </div>

      {/* Current Plan Usage */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">{CURRENT_PLAN.name}</h2>
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full">Active</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Renews on May 1, 2026</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            <ArrowUp className="w-4 h-4" /> Upgrade Plan
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Daily API Requests</span>
              <span className={`font-medium ${(CURRENT_PLAN.dailyUsed / CURRENT_PLAN.dailyLimit) > 0.9 ? 'text-red-400' : 'text-white'}`}>
                {CURRENT_PLAN.dailyUsed.toLocaleString()} / {CURRENT_PLAN.dailyLimit.toLocaleString()}
              </span>
            </div>
            <ProgressBar value={CURRENT_PLAN.dailyUsed} max={CURRENT_PLAN.dailyLimit} color="cyan" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Monthly Orders</span>
              <span className="font-medium text-white">{CURRENT_PLAN.monthlyOrdersUsed} / {CURRENT_PLAN.monthlyOrders}</span>
            </div>
            <ProgressBar value={CURRENT_PLAN.monthlyOrdersUsed} max={CURRENT_PLAN.monthlyOrders} color="violet" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Active eSIMs</span>
              <span className="font-medium text-white">{CURRENT_PLAN.esimUsed} / {CURRENT_PLAN.esimLimit}</span>
            </div>
            <ProgressBar value={CURRENT_PLAN.esimUsed} max={CURRENT_PLAN.esimLimit} color="amber" />
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {TIERS.map(tier => {
            const Icon = tier.icon;
            const colorMap: Record<string, string> = {
              slate: 'border-white/5',
              cyan: 'border-cyan-500/30 bg-cyan-500/5',
              violet: 'border-violet-500/20',
              amber: 'border-amber-500/20',
            };
            const iconColorMap: Record<string, string> = {
              slate: 'text-slate-400', cyan: 'text-cyan-400', violet: 'text-violet-400', amber: 'text-amber-400',
            };
            return (
              <div key={tier.name} className={`bg-[#111120] border rounded-2xl p-5 ${colorMap[tier.color]} relative`}>
                {(tier as any).current && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-cyan-500 text-slate-900 font-bold px-3 py-0.5 rounded-full">Current</span>
                )}
                <Icon className={`w-6 h-6 mb-3 ${iconColorMap[tier.color]}`} />
                <p className="font-bold text-white text-lg">{tier.name}</p>
                <p className="text-2xl font-black text-white mt-1 mb-1">{tier.price}</p>
                <p className="text-slate-500 text-sm">{tier.requests}</p>
                {!(tier as any).current && (
                  <button className={`w-full mt-4 py-2 rounded-xl text-sm font-bold transition-colors ${tier.color === 'violet' ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30' : tier.color === 'amber' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {tier.name === 'ENTERPRISE' ? 'Contact Sales' : 'Upgrade'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="font-bold text-white">Invoice History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-slate-500 px-6 py-3">Invoice</th>
              <th className="text-left text-xs text-slate-500 px-6 py-3">Period</th>
              <th className="text-left text-xs text-slate-500 px-6 py-3">Amount</th>
              <th className="text-left text-xs text-slate-500 px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {INVOICES.map(inv => (
              <tr key={inv.id} className="hover:bg-white/2">
                <td className="px-6 py-4"><code className="text-slate-400 text-sm">{inv.id}</code></td>
                <td className="px-6 py-4 text-slate-300 text-sm">{inv.date}</td>
                <td className="px-6 py-4 text-white font-medium">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full">{inv.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 text-sm transition-colors">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
