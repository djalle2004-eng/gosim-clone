import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  QrCode, Copy, RefreshCw, MoreVertical, AlertTriangle,
  Wifi, Phone, ChevronDown, ChevronUp, Activity,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { api } from '../../../lib/api';
import CountryFlag from '../../../components/ui/CountryFlag';

type Tab = 'ACTIVE' | 'EXPIRED' | 'INACTIVE';

const MOCK_CHART = Array.from({ length: 7 }, (_, i) => ({
  day: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][i],
  mb: Math.floor(Math.random() * 800 + 100),
}));

export default function DashboardESimsPage() {
  const [tab, setTab] = useState<Tab>('ACTIVE');
  const [qrModal, setQrModal] = useState<any>(null);
  const [apnModal, setApnModal] = useState<any>(null);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders-esims'],
    queryFn: async () => { const r = await api.get('/orders'); return r.data; },
  });

  const copyText = (t: string) => navigator.clipboard.writeText(t);

  const esims = orders.flatMap((o: any) =>
    o.orderItems.flatMap((item: any) =>
      item.assignedESims.map((e: any) => ({
        id: e.id,
        planName: item.plan.name,
        flag: item.plan.country?.flag || '🌐',
        countryCode: item.plan.country?.code || '',
        countryName: item.plan.country?.nameAr || item.plan.country?.nameEn || '',
        status: e.status as Tab,
        usedData: (e.dataUsed / 1024).toFixed(2),
        totalData: (e.dataTotal / 1024).toFixed(2),
        daysRemaining: e.expiresAt
          ? Math.max(0, Math.ceil((new Date(e.expiresAt).getTime() - Date.now()) / 86400000))
          : item.plan.validity,
        iccid: e.iccid,
        activationCode: e.activationCode || e.qrCode,
        isUnlimited: item.plan.isUnlimited,
      }))
    )
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ACTIVE', label: 'نشطة' },
    { key: 'INACTIVE', label: 'قيد الانتظار' },
    { key: 'EXPIRED', label: 'منتهية' },
  ];

  const filtered = esims.filter((e: any) => e.status === tab);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">eSIM الخاصة بي</h1>
        <p className="text-slate-500">إدارة وتتبع استهلاك باقات الإنترنت.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6 bg-white border border-slate-200 rounded-2xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t.key ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
            <span className={`mr-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {esims.filter((e: any) => e.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* ESim Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center">
          <Wifi className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg font-medium">لا توجد شرائح في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {filtered.map((esim: any, idx: number) => {
            const pct = esim.isUnlimited ? 100 : Math.min(100, (parseFloat(esim.usedData) / parseFloat(esim.totalData)) * 100);
            const isLow = pct > 80;
            const isChartOpen = expandedChart === esim.id;

            return (
              <motion.div
                key={esim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
                  esim.status === 'ACTIVE' ? 'border-emerald-200' : 'border-slate-200'
                }`}
              >
                {/* Card Header */}
                <div className={`p-5 ${esim.status === 'ACTIVE' ? 'bg-gradient-to-l from-emerald-50 to-white' : 'bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CountryFlag code={esim.countryCode} size="lg" className="shadow" />
                      <div>
                        <h3 className="font-bold text-slate-800">{esim.planName}</h3>
                        <p className="text-slate-400 text-xs font-mono">ICCID: ···{esim.iccid?.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        esim.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' :
                        esim.status === 'INACTIVE' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {esim.status === 'ACTIVE' ? '● نشط' : esim.status === 'INACTIVE' ? 'قيد الانتظار' : 'منتهي'}
                      </span>
                      <button className="text-slate-400 p-1"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                {/* Data Usage */}
                <div className="px-5 py-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">الداتا المستخدمة</span>
                    <span className="font-bold text-slate-700">
                      {esim.usedData} / {esim.isUnlimited ? '∞' : esim.totalData} GB
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${isLow ? 'from-orange-400 to-red-500' : 'from-cyan-500 to-blue-500'}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={`flex items-center gap-1 ${esim.daysRemaining <= 3 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {esim.daysRemaining} يوم متبقي
                    </span>
                    <button
                      onClick={() => setExpandedChart(isChartOpen ? null : esim.id)}
                      className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600 transition-colors font-medium"
                    >
                      <Activity className="w-3 h-3" />
                      الاستهلاك اليومي
                      {isChartOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Daily Usage Chart */}
                <AnimatePresence>
                  {isChartOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 160, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-4 pb-2"
                    >
                      <ResponsiveContainer width="100%" height={140}>
                        <LineChart data={MOCK_CHART}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit=" MB" />
                          <Tooltip
                            formatter={(v: number) => [`${v} MB`, 'الاستهلاك']}
                            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                          />
                          <Line type="monotone" dataKey="mb" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="px-5 pb-5 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQrModal(esim)}
                    className="flex flex-col items-center gap-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-slate-600"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs font-medium">QR كود</span>
                  </button>
                  <button
                    onClick={() => setApnModal(esim)}
                    className="flex flex-col items-center gap-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-slate-600"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">APN</span>
                  </button>
                  <button
                    disabled={esim.status === 'EXPIRED'}
                    className="flex flex-col items-center gap-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs font-bold">تجديد</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQrModal(null)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-center text-white">
                <h3 className="font-bold text-lg">تثبيت eSIM</h3>
                <p className="text-sm opacity-80">امسح الكود لإضافة الشريحة</p>
              </div>
              <div className="p-6 text-center">
                <div className="bg-white border-4 border-slate-100 rounded-2xl w-44 h-44 mx-auto mb-5 flex items-center justify-center shadow-inner overflow-hidden">
                  {qrModal.activationCode?.includes('LPA:1$') ? (
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrModal.activationCode)}`} alt="QR" className="w-full" />
                  ) : (
                    <QrCode className="w-20 h-20 text-slate-300" />
                  )}
                </div>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 mb-4 overflow-hidden">
                  <code className="flex-1 px-3 py-2 text-xs text-cyan-600 font-mono truncate">
                    {qrModal.activationCode?.slice(0, 30)}...
                  </code>
                  <button onClick={() => copyText(qrModal.activationCode)}
                    className="bg-slate-200 hover:bg-slate-300 px-3 rounded-lg flex items-center gap-1 text-xs transition-colors">
                    <Copy className="w-3 h-3" /> نسخ
                  </button>
                </div>
                <button onClick={() => setQrModal(null)}
                  className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors">
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APN Modal */}
      <AnimatePresence>
        {apnModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setApnModal(null)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5 text-center text-white">
                <h3 className="font-bold text-lg">إعدادات APN</h3>
                <p className="text-sm opacity-80">استخدم هذه الإعدادات يدوياً إذا لزم الأمر</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: 'APN', value: 'internet' },
                  { label: 'اسم المستخدم', value: '' },
                  { label: 'كلمة المرور', value: '' },
                  { label: 'بروتوكول', value: 'IPv4/IPv6' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">{row.label}</span>
                    <span className="font-mono text-slate-800 text-sm">{row.value || '—'}</span>
                  </div>
                ))}
                <button onClick={() => setApnModal(null)}
                  className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 font-medium">إغلاق</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
