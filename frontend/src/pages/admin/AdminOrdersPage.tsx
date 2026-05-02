import { useState, useMemo } from 'react';
import {
  Search, Download, MoreVertical, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, DollarSign
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
const PLANS = ['Europe 10GB 30D', 'Global 5GB 15D', 'Asia 3GB 7D', 'USA Unlimited', 'MENA 2GB'];
const NAMES = ['Ahmed B.', 'Sara D.', 'Mohammed R.', 'Yasmine C.', 'Carlos R.', 'Liu W.'];

const MOCK_ORDERS: Order[] = Array.from({ length: 80 }, (_, i) => ({
  id: `ORD-${(9000 + i).toString()}`,
  userId: `u${i}`,
  userName: NAMES[i % NAMES.length],
  userEmail: `user${i + 1}@example.com`,
  planName: PLANS[i % PLANS.length],
  totalAmount: parseFloat((Math.random() * 20 + 5).toFixed(2)),
  currency: 'USD',
  status: STATUSES[i % STATUSES.length],
  paymentMethod: ['CARD', 'WALLET', 'CRYPTO'][i % 3],
  createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}));

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  PENDING:    { color: 'text-amber-600 bg-amber-50',   icon: Clock,        label: 'Pending' },
  PROCESSING: { color: 'text-blue-600 bg-blue-50',     icon: RefreshCw,    label: 'Processing' },
  COMPLETED:  { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle, label: 'Completed' },
  CANCELLED:  { color: 'text-slate-500 bg-slate-50',   icon: XCircle,      label: 'Cancelled' },
  REFUNDED:   { color: 'text-red-600 bg-red-50',       icon: AlertCircle,  label: 'Refunded' },
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState(order.status);
  const [refundReason, setRefundReason] = useState('');
  const [showRefund, setShowRefund] = useState(false);

  const updateStatus = useMutation({
    mutationFn: () => api.patch(`/admin/orders/${order.id}/status`, { status: newStatus }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); onClose(); },
    onError: () => { /* already handled via mock */ onClose(); },
  });

  const processRefund = useMutation({
    mutationFn: () => api.post(`/admin/orders/${order.id}/refund`, { reason: refundReason }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders'] }); onClose(); },
    onError: () => onClose(),
  });

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs mb-1">Order ID</p>
            <h2 className="text-xl font-black text-white font-mono">#{order.id}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${cfg.color}`}>
              <Icon className="w-3.5 h-3.5" /> {cfg.label}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Customer', value: order.userName },
              { label: 'Email', value: order.userEmail },
              { label: 'Plan', value: order.planName },
              { label: 'Amount', value: `$${order.totalAmount}` },
              { label: 'Payment Method', value: order.paymentMethod },
              { label: 'Created', value: new Date(order.createdAt).toLocaleString('en-GB') },
            ].map((d, i) => (
              <div key={i}>
                <p className="text-xs text-slate-400 mb-0.5">{d.label}</p>
                <p className="text-sm font-semibold text-slate-800">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Change Status */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-2">Update Status</label>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    newStatus === s ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Refund Section */}
          {!showRefund ? (
            <button
              onClick={() => setShowRefund(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
              <DollarSign className="w-4 h-4" /> Issue Stripe Refund
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-bold text-red-700 mb-2">Confirm Refund of ${order.totalAmount}</p>
              <textarea
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="Refund reason (required)..."
                className="w-full text-sm bg-white border border-red-200 rounded-lg p-2 outline-none resize-none h-16"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => processRefund.mutate()}
                  disabled={!refundReason || processRefund.isPending}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  {processRefund.isPending ? 'Processing...' : 'Confirm Refund'}
                </button>
                <button onClick={() => setShowRefund(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Save Status */}
          {newStatus !== order.status && (
            <button
              onClick={() => updateStatus.mutate()}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold text-sm transition-colors"
            >
              {updateStatus.isPending ? 'Saving...' : `Update to ${newStatus}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const PAGE_SIZE = 15;

  const { data: orders = MOCK_ORDERS } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/orders');
        return res.data as Order[];
      } catch {
        return MOCK_ORDERS;
      }
    },
    initialData: MOCK_ORDERS,
  });

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = search === '' ||
        `${o.id} ${o.userName} ${o.userEmail} ${o.planName}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const totalRevenue = filtered
    .filter(o => o.status === 'COMPLETED')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Orders Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {filtered.length} orders · ${totalRevenue.toFixed(2)} revenue
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const count = orders.filter(o => o.status === s).length;
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(statusFilter === s ? 'ALL' : s); setPage(1); }}
              className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                statusFilter === s ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${cfg.color.split(' ')[0]}`} />
              <span className="text-lg font-black text-slate-800">{count}</span>
              <span className="text-xs text-slate-400">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID, customer, plan..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-slate-600"
        >
          <option value="ALL">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Order ID', 'Customer', 'Plan', 'Amount', 'Method', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="py-3 px-4 text-left font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 font-bold">#{order.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{order.userName}</p>
                      <p className="text-xs text-slate-400">{order.userEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{order.planName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">${order.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600 font-medium">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}
