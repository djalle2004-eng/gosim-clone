import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Wifi,
  Clock,
  Zap,
  Globe2,
  Shield,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { getCountryImage } from '../../../lib/country-images';

interface PlanDrawerProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanDrawer({ plan, isOpen, onClose }: PlanDrawerProps) {
  if (!plan) return null;

  const EXCHANGE_RATE = 135;
  const priceDZD = (plan.price * EXCHANGE_RATE).toFixed(0);

  // Handle both flat dummy data and nested backend data
  const countryName = plan.country?.nameAr || plan.countryName || plan.name;
  const countryNameEn = plan.country?.nameEn || plan.countryNameEn || '';
  const countryCode = plan.country?.code || plan.countryCode || 'GLOBAL';
  const flag = plan.country?.flag || plan.flag || '🌍';
  const validityDays = plan.validity || plan.validityDays;
  const dataAmount = plan.dataAmount;
  const networkSpeed = plan.speed || plan.networkSpeed || '4G/5G';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
            dir="rtl"
          >
            <div className="relative h-64 flex-shrink-0">
              <img
                src={getCountryImage(
                  countryCode,
                  plan.country?.region || plan.region
                )}
                alt={countryName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-slate-100">
                  {flag}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {countryName}
                  </h2>
                  <span className="text-white/80 font-medium">
                    {countryNameEn}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-3xl font-black text-slate-900">
                    ${plan.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500 font-medium mt-1">
                    ~ {priceDZD} د.ج
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">التقييم</div>
                  <div className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    4.8 <span className="text-yellow-400">★</span>{' '}
                    <span className="text-xs font-normal text-slate-400">
                      (120)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-cyan-100 p-2 rounded-xl mt-1">
                    <Wifi className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">البيانات</div>
                    <div className="font-bold text-slate-900">
                      {dataAmount === -1 ? 'غير محدود' : `${dataAmount} GB`}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl mt-1">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">المدة</div>
                    <div className="font-bold text-slate-900">
                      {validityDays} يوم
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-yellow-100 p-2 rounded-xl mt-1">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">السرعة</div>
                    <div className="font-bold text-slate-900">
                      {networkSpeed}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl mt-1">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">النوع</div>
                    <div className="font-bold text-slate-900">بيانات فقط</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  الشبكات المدعومة
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-slate-700 font-medium">
                      <Globe2 className="w-4 h-4 text-slate-400" />
                      Orange, Vodafone, O2
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  هذه الخطة الإلكترونية مخصصة للبيانات فقط. لا تتضمن رقم هاتف
                  للمكالمات أو الرسائل النصية. التفعيل يتم تلقائياً عند الاتصال
                  بالشبكة المدعومة في بلد الوجهة.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
                <button className="p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-colors border border-slate-100 hover:border-red-100">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  أضف إلى السلة
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
