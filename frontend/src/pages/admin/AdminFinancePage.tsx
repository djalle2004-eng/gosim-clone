import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, TrendingUp, Users, RefreshCw, Download, FileText, CheckCircle
} from 'lucide-react';
import api from '../../shared/lib/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'taxes'>('overview');

  // Queries
  const { data: summary } = useQuery({
    queryKey: ['admin-finance-summary'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/summary');
      return res.data.data;
    }
  });

  const { data: revenueData } = useQuery({
    queryKey: ['admin-finance-revenue'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/revenue?period=daily');
      return res.data.data;
    }
  });

  const { data: commissions } = useQuery({
    queryKey: ['admin-finance-commissions'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/commissions/pending');
      return res.data.data;
    }
  });

  const { data: taxes } = useQuery({
    queryKey: ['admin-finance-taxes'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/tax/report');
      return res.data.data;
    }
  });

  const handleExport = () => {
    alert('Exporting to Excel (Mock)...');
  };

  const handlePayout = async (id: string) => {
    try {
      await api.post('/admin/finance/commissions/payout', { referralIds: [id], method: 'paypal' });
      alert('Payout processed successfully!');
    } catch (e) {
      alert('Failed to process payout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Hub</h1>
          <p className="text-slate-500">P&L, Commissions, and Tax Reports</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-2 font-medium transition-colors ${
            activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Overview (P&L)
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`pb-2 px-2 font-medium transition-colors ${
            activeTab === 'commissions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Reseller Payouts
        </button>
        <button
          onClick={() => setActiveTab('taxes')}
          className={`pb-2 px-2 font-medium transition-colors ${
            activeTab === 'taxes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Tax Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium">MRR</div>
              <div className="text-2xl font-bold text-slate-800">${summary?.mrr?.toLocaleString() || '0'}</div>
              <div className="text-xs text-green-500 mt-1">+12% vs last month</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium">Gross Margin</div>
              <div className="text-2xl font-bold text-slate-800">{summary?.grossMargin || '0'}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium">Net Revenue</div>
              <div className="text-2xl font-bold text-slate-800">${summary?.netRevenue?.toLocaleString() || '0'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-slate-500 text-sm font-medium">Churn Rate</div>
              <div className="text-2xl font-bold text-red-500">{summary?.churnRate || '0'}%</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Cash Flow (30 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => '$'+val} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Reseller</th>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Commission</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {commissions?.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No pending payouts.</td></tr>
              )}
              {commissions?.map((c: any) => (
                <tr key={c.id}>
                  <td className="p-4 font-medium text-slate-800">{c.referrer.firstName} {c.referrer.lastName}</td>
                  <td className="p-4 text-slate-500">{c.orderId.slice(0, 8)}</td>
                  <td className="p-4 font-bold text-green-600">${c.commissionAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handlePayout(c.id)}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-100"
                    >
                      Pay via PayPal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'taxes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium">Order Count</th>
                <th className="p-4 font-medium">Gross Revenue</th>
                <th className="p-4 font-medium">Collected Tax (VAT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {taxes?.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No tax data available for this period.</td></tr>
              )}
              {taxes?.map((t: any) => (
                <tr key={t.country}>
                  <td className="p-4 font-medium text-slate-800">{t.country}</td>
                  <td className="p-4 text-slate-500">{t.orderCount}</td>
                  <td className="p-4 font-medium text-slate-800">${t.totalAmount.toFixed(2)}</td>
                  <td className="p-4 font-bold text-red-500">${t.totalTax.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
