import { useState } from 'react';
import { Download, FileText, ArrowUpRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mocked state
  const mockOrders = [
    {
      id: 'ORD-2024-9981',
      date: '12 أفريل 2026',
      status: 'COMPLETED',
      total: 2800,
      currency: 'د.ج',
      paymentMethod: 'CIB',
      items: [{ name: 'باقة أوروبا 10GB', flag: '🇪🇺' }],
    },
    {
      id: 'ORD-2024-9975',
      date: '05 أفريل 2026',
      status: 'PROCESSING',
      total: 1200,
      currency: 'د.ج',
      paymentMethod: 'Stripe',
      items: [{ name: 'باقة تركيا 5GB', flag: '🇹🇷' }],
    },
    {
      id: 'ORD-2024-9910',
      date: '28 مارس 2026',
      status: 'REFUNDED',
      total: 800,
      currency: 'د.ج',
      paymentMethod: 'الذهبية',
      items: [{ name: 'باقة الإمارات 1GB', flag: '🇦🇪' }],
    },
  ];

  const filteredOrders =
    activeTab === 'ALL'
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeTab);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            تاريخ الطلبات
          </h1>
          <p className="text-slate-500">
            تتبع جميع فواتيرك وطلباتك الجارية والسابقة من هنا.
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          <input
            type="text"
            placeholder="رقم الطلب..."
            className="bg-slate-50 border border-slate-200 rounded-xl py-2 pr-10 pl-4 outline-none focus:border-cyan-500 text-slate-800 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white/90 backdrop-blur-md border border-slate-200/50 p-1.5 rounded-2xl w-max">
        {[
          { id: 'ALL', label: 'الكل' },
          { id: 'PROCESSING', label: 'قيد المعالجة' },
          { id: 'COMPLETED', label: 'مكتمل' },
          { id: 'REFUNDED', label: 'مُسترجع' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 text-background shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-md w-full border border-slate-200/50 rounded-3xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200/50 text-slate-500 text-sm font-medium">
              <th className="py-5 px-6 text-right">رقم الطلب</th>
              <th className="py-5 px-6 text-right">التاريخ</th>
              <th className="py-5 px-6 text-right">الباقة</th>
              <th className="py-5 px-6 text-right">المبلغ</th>
              <th className="py-5 px-6 text-right">الحالة</th>
              <th className="py-5 px-6 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id}
                className="border-b border-slate-200/50 hover:bg-slate-100 transition-colors group cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="py-5 px-6 font-mono text-cyan-400 text-sm">
                  {order.id}
                </td>
                <td className="py-5 px-6 text-slate-800 text-sm">
                  {order.date}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{order.items[0].flag}</span>
                    <span className="text-slate-800 font-medium text-sm">
                      {order.items[0].name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-slate-800 font-bold">
                  {order.total} {order.currency}
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      order.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : order.status === 'PROCESSING'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {order.status === 'COMPLETED'
                      ? 'مكتمل'
                      : order.status === 'PROCESSING'
                        ? 'معالجة'
                        : 'مسترجع'}
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center mx-auto text-slate-500 group-hover:text-slate-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  لا توجد طلبات في هذا التصنيف.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/90 backdrop-blur-md w-full max-w-xl rounded-3xl overflow-hidden relative z-10 border border-slate-200 shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-slate-100">
                <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> تفاصيل الطلب{' '}
                  {selectedOrder.id}
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {selectedOrder.items[0].flag}
                    </span>
                    <div>
                      <div className="text-slate-800 font-bold">
                        {selectedOrder.items[0].name}
                      </div>
                      <div className="text-slate-500 text-xs">
                        رقم الهاتف: غير مرتبط
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-800 font-bold">
                    {selectedOrder.total} {selectedOrder.currency}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                    <span className="block text-slate-400 mb-1">
                      طريقة الدفع
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                    <span className="block text-slate-400 mb-1">
                      تاريخ الطلب
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedOrder.date}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-6 flex justify-between items-end">
                  <div className="text-slate-500 text-xs">
                    رسوم التفعيل: 0.00 د.ج
                    <br />
                    الضريبة المضافة: متضمنة
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm mb-1">
                      الإجمالي المدفوع
                    </div>
                    <div className="text-2xl font-black text-cyan-400">
                      {selectedOrder.total} {selectedOrder.currency}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200/50 bg-slate-50 flex justify-between gap-4">
                <button className="flex items-center gap-2 text-cyan-400 px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-colors font-medium">
                  <Download className="w-4 h-4" /> تحميل الفاتورة (PDF)
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-white/20 text-slate-800 rounded-lg transition-colors font-bold"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
