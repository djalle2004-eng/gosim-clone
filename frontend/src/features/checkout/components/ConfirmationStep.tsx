import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { CheckCircle2, QrCode, Download, Share2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface ConfirmationStepProps {
  orderId: string;
}

export default function ConfirmationStep({ orderId }: ConfirmationStepProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-confirmation', orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderId}`);
      return res.data;
    },
    // Poll to make sure the webhook processed the eSIM if it was pending
    refetchInterval: (query) =>
      query.state.data?.status === 'PAID' &&
      query.state.data?.orderItems?.[0]?.assignedESims?.length > 0
        ? false
        : 3000,
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">جاري إصدار الشريحة الخاصة بك (eSIM)...</p>
      </div>
    );
  }

  // Find the first assigned eSIM for immediate display
  const assignedEsim = order?.orderItems?.[0]?.assignedESims?.[0];

  return (
    <div className="max-w-3xl mx-auto">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-2">تم الدفع بنجاح!</h2>
          <p className="text-emerald-50">
            طلبك رقم #{order?.id.substring(0, 8).toUpperCase()} قيد التنفيذ.
          </p>
        </div>

        <div className="p-8">
          {assignedEsim ? (
            <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <img
                  src={assignedEsim.qrCodeUrl}
                  alt="eSIM QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                    <QrCode className="text-cyan-500" /> امسح الكود لتفعيل
                    الشريحة
                  </h3>
                  <p className="text-slate-500 mt-1">
                    افتح كاميرا هاتفك وامسح الـ QR Code لتثبيت باقة البيانات
                    فوراً.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                  <div className="font-mono text-sm text-slate-600 truncate mr-2">
                    {assignedEsim.lpaString}
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(assignedEsim.lpaString)
                    }
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0"
                    title="نسخ كود التفعيل اليدوي"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  يمكنك استخدام الكود أعلاه للتفعيل اليدوي إذا لم ينجح الـ QR.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-2xl mb-8 flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
              <div>
                <h4 className="font-bold mb-1">جاري إصدار الشريحة</h4>
                <p className="text-sm">
                  يتم الآن تجهيز شريحتك مع مزود الخدمة. يرجى الانتظار، سيظهر كود
                  التفعيل هنا تلقائياً خلال ثوانٍ...
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/esims"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors"
            >
              عرض شرائحي (eSIMs)
            </Link>
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-colors">
              <Download className="w-5 h-5" /> الفاتورة PDF
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-colors">
              <Share2 className="w-5 h-5" /> مشاركة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
