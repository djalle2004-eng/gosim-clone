import { useState } from 'react';
import {
  QrCode,
  Copy,
  RefreshCw,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import CountryFlag from '../../components/ui/CountryFlag';

export default function MyESimsPage() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders-esims'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    },
  });

  const handleOpenQR = (esim: any) => {
    setSelectedEsim(esim);
    setQrModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Flatten the payload: orders > orderItems > assignedESims
  const esims =
    orders?.flatMap((order: any) =>
      order.orderItems.flatMap((item: any) =>
        item.assignedESims.map((esim: any) => ({
          id: esim.id,
          planName: item.plan.name,
          flag: item.plan.country?.flag || '🌐',
          countryCode: item.plan.country?.code || '',
          status: esim.status,
          usedData: (esim.dataUsed / 1024).toFixed(1),
          totalData: (esim.dataTotal / 1024).toFixed(1),
          daysRemaining: esim.expiresAt
            ? Math.max(
                0,
                Math.ceil(
                  (new Date(esim.expiresAt).getTime() - new Date().getTime()) /
                    (1000 * 3600 * 24)
                )
              )
            : item.plan.validity,
          iccid: esim.iccid,
          activationCode: esim.activationCode || esim.qrCode,
          isUnlimited: item.plan.isUnlimited,
        }))
      )
    ) || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          eSIM الخاصة بي
        </h1>
        <p className="text-slate-500">
          قم بإدارة وتتبع استهلاك باقات الإنترنت الحالية والسابقة.
        </p>
      </div>

      {esims.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-12 text-center py-32">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            لا توجد باقات مفعلة
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            يبدو أنك لم تقم بشراء أي شريحة eSIM بعد. يمكنك استكشاف باقاتنا
            المميزة.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {esims.map((esim: any, idx: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={esim.id}
              className={`bg-white/90 backdrop-blur-md border rounded-3xl p-6 relative overflow-hidden flex flex-col ${
                esim.status === 'ACTIVE'
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                  : esim.status === 'INACTIVE'
                    ? 'border-cyan-500/30'
                    : 'border-slate-200/50 opacity-75'
              }`}
            >
              {/* Status Head */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <CountryFlag
                    code={esim.countryCode}
                    size="lg"
                    className="shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {esim.planName}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      ICCID: {esim.iccid.slice(-6)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      esim.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        : esim.status === 'INACTIVE'
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {esim.status === 'ACTIVE' && 'نشط الآن'}
                    {esim.status === 'INACTIVE' && 'غير مفعّل'}
                    {esim.status === 'EXPIRED' && 'منتهي'}
                  </span>
                  <button className="text-slate-400 hover:text-slate-900 transition-colors p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Body */}
              {esim.status !== 'INACTIVE' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-4 mb-6 relative overflow-hidden">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-500">البيانات المستخدمة</span>
                    <span className="text-slate-800 font-bold">
                      {esim.usedData} GB /{' '}
                      {esim.isUnlimited ? '∞' : `${esim.totalData} GB`}
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-4 backdrop-blur-sm overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: esim.isUnlimited
                          ? '100%'
                          : `${(parseFloat(esim.usedData) / parseFloat(esim.totalData)) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r rounded-full ${
                        !esim.isUnlimited &&
                        parseFloat(esim.usedData) / parseFloat(esim.totalData) >
                          0.8
                          ? 'from-orange-500 to-red-500'
                          : 'from-emerald-400 to-cyan-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div
                      className={`flex items-center gap-1.5 ${esim.daysRemaining <= 3 ? 'text-red-400 font-bold' : 'text-slate-500'}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {esim.daysRemaining} أيام متبقية
                    </div>
                    {esim.status === 'ACTIVE' && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{' '}
                        متصل
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/50">
                <button
                  onClick={() => handleOpenQR(esim)}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 py-3 rounded-xl transition-colors font-medium text-sm"
                >
                  <QrCode className="w-4 h-4" /> عرض الكود
                </button>
                <button
                  disabled={esim.status === 'EXPIRED'}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-800 disabled:opacity-50 py-3 rounded-xl transition-all font-medium text-sm shadow-md"
                >
                  <RefreshCw className="w-4 h-4" /> شحن بيانات
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QR Code Modal (Framer Motion) */}
      <AnimatePresence>
        {qrModalOpen && selectedEsim && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQrModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-3xl overflow-hidden relative z-10 border border-slate-200 shadow-2xl"
            >
              <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-6 text-center">
                <h3 className="text-slate-800 font-bold text-xl mb-1">
                  تثبيت شريحة eSIM
                </h3>
                <p className="text-slate-800/80 text-sm">
                  امسح الكود عبر إعدادات الشبكة الخلوية في هاتفك
                </p>
              </div>

              <div className="p-8">
                {/* QR Generator if raw code, else show image if already generated via Airalo payload */}
                <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-6 flex justify-center items-center shadow-inner overflow-hidden">
                  {selectedEsim.activationCode?.includes('LPA:1$') ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedEsim.activationCode)}`}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={selectedEsim.activationCode}
                      alt="Base64 QR"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Manual Code */}
                <div className="mb-6">
                  <label className="block text-slate-400 text-xs mb-2 text-center">
                    أو أدخل الرمز يدوياً
                  </label>
                  <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 overflow-hidden">
                    <code className="flex-1 px-4 py-3 text-xs text-cyan-400 font-mono truncate self-center">
                      {selectedEsim.activationCode?.slice(0, 25)}...
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedEsim.activationCode)
                      }
                      className="bg-slate-200 hover:bg-white/20 text-slate-800 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" /> نسخ
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setQrModalOpen(false)}
                  className="w-full py-4 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                >
                  إغلاق وتخطي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
