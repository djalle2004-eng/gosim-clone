import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Filter,
  Search,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { api } from '../../../lib/api';

type StatusFilter = 'ALL' | 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; badge: string }
> = {
  PAID: {
    label: 'مدفوع',
    icon: CheckCircle2,
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  PENDING: {
    label: 'معلق',
    icon: Clock,
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  FAILED: {
    label: 'فاشل',
    icon: XCircle,
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  CANCELLED: {
    label: 'ملغى',
    icon: XCircle,
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

export default function DashboardOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const r = await api.get('/orders');
      return r.data;
    },
  });

  const filtered = useMemo(() => {
    return orders.filter((o: any) => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (search && !o.id.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (dateFrom && new Date(o.createdAt) < new Date(dateFrom)) return false;
      return true;
    });
  }, [orders, statusFilter, search, dateFrom]);

  const exportCSV = () => {
    const headers = ['رقم الطلب', 'التاريخ', 'الخطط', 'المبلغ', 'الحالة'];
    const rows = filtered.map((o: any) => [
      o.id.slice(0, 8).toUpperCase(),
      new Date(o.createdAt).toLocaleDateString('ar-DZ'),
      o.orderItems.map((i: any) => i.plan?.name).join(' | '),
      `$${o.totalPrice?.toFixed(2)}`,
      STATUS_CONFIG[o.status]?.label || o.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">طلباتي</h1>
        <p className="text-slate-500">سجل كامل بجميع عمليات الشراء.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-transparent text-sm text-slate-700 outline-none pr-2"
            >
              <option value="ALL">كل الحالات</option>
              <option value="PAID">مدفوع</option>
              <option value="PENDING">معلق</option>
              <option value="FAILED">فاشل</option>
              <option value="CANCELLED">ملغى</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all mr-auto"
        >
          <Download className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">لا توجد طلبات مطابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    رقم الطلب
                  </th>
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    التاريخ
                  </th>
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    الخطة
                  </th>
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    المبلغ
                  </th>
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    الحالة
                  </th>
                  <th className="px-5 py-3 text-right font-bold text-slate-500 text-xs">
                    فاتورة
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any, idx: number) => {
                  const cfg =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const Icon = cfg.icon;
                  const planNames = order.orderItems
                    .map((i: any) => i.plan?.name)
                    .join(', ');

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-slate-700 font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                      </td>
                      <td className="px-5 py-4 text-slate-700 max-w-[180px] truncate">
                        {planNames}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.status === 'PAID' && (
                          <button className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
