import { Wifi, Zap, Bookmark, ShoppingCart, Check, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CountryFlag from '../ui/CountryFlag';
import { getCountryImage } from '../../lib/country-images';
import { useAuth } from '../../context/AuthContext';

interface PlanCardProps {
  plan: any;
  idx?: number;
}

export default function PlanCard({ plan, idx = 0 }: PlanCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isReseller = user?.role === 'RESELLER';
  const discountRate = user?.discountRate || 0;
  const originalPrice = plan.price;
  const finalPrice = isReseller
    ? originalPrice * (1 - discountRate / 100)
    : originalPrice;

  const handleBuy = () => {
    navigate(`/checkout?planId=${plan.id}&qty=1`);
  };

  const bgImage = getCountryImage(plan.country?.code, plan.country?.region);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="relative group flex flex-col h-full"
    >
      <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-500 rounded-3xl relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-cyan-500/10 group-hover:-translate-y-1">
        {/* Dark gradient overlay for readability over the background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-20 group-hover:opacity-30"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-[#0a0a0f]/80 to-[#0a0a0f]/40" />

        {/* Top accent line */}
        {plan.isBestSeller && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 z-20" />
        )}

        {/* Background pattern
        <div
          className="absolute inset-0 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        /> */}

        {/* Best seller badge */}
        {plan.isBestSeller && (
          <div className="absolute -top-0 left-6 z-20">
            <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 text-slate-800 text-[11px] font-bold px-4 py-1.5 rounded-b-xl shadow-lg shadow-violet-500/30 flex items-center gap-1.5">
              🔥 الأكثر مبيعاً
            </div>
          </div>
        )}

        {/* Bookmark button */}
        <button className="absolute top-5 left-5 text-slate-500 hover:text-cyan-400 transition-colors z-20 p-2.5 bg-black/20 hover:bg-black/40 rounded-xl border border-white/[0.06] backdrop-blur-sm">
          <Bookmark className="w-4 h-4" />
        </button>

        <div className="p-6 flex flex-col h-full relative z-20">
          {/* Country info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="group-hover:scale-110 transition-transform duration-500">
              <CountryFlag
                code={plan.country?.code}
                size="xl"
                className="shadow-xl ring-2 ring-white/10"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-0.5 drop-shadow-md">
                {plan.country?.nameEn}
              </h3>
              <p className="text-slate-600 text-sm flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                {plan.name}
              </p>
            </div>
          </div>

          {/* Data highlight + stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center col-span-2 border border-cyan-500/20 group-hover:border-cyan-500/40 shadow-inner transition-colors">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                البيانات
              </span>
              <span className="text-slate-800 font-black text-2xl tracking-tight">
                {plan.isUnlimited ? (
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    غير محدود
                  </span>
                ) : (
                  <>
                    {plan.dataAmount}{' '}
                    <span className="text-slate-500 text-sm font-medium">
                      GB
                    </span>
                  </>
                )}
              </span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3.5 text-center border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
              <span className="block text-slate-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                الصلاحية
              </span>
              <span className="text-slate-800 font-bold text-lg">
                {plan.validity}{' '}
                <span className="text-slate-500 text-xs">يوم</span>
              </span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3.5 text-center border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
              <span className="block text-slate-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                السرعة
              </span>
              <span className="text-cyan-400 font-bold text-lg">
                {plan.speed}
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-3.5 h-3.5" />
              </div>
              اتصال فوري بالشريحة دون انتظار
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              دعم مشاركة الاتصال (Hotspot)
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
                <Check className="w-3.5 h-3.5" />
              </div>
              بدون رسوم إعداد
            </li>
          </ul>

          {/* Price & CTA */}
          <div className="mt-auto">
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-none">
                  {Math.round(finalPrice)}
                </span>
                <span className="text-cyan-400 font-bold text-sm mb-0.5">
                  {plan.displayCurrency || 'DZD'}
                </span>
                {isReseller && discountRate > 0 && (
                  <span className="text-slate-400 text-xs mb-0.5 mr-2 line-through">
                    {Math.round(originalPrice)} {plan.displayCurrency || 'DZD'}
                  </span>
                )}
                {!isReseller && (
                  <span className="text-slate-400 text-xs mb-0.5 mr-2 line-through">
                    {Math.round(plan.price * 1.2)} {plan.displayCurrency || 'DZD'}
                  </span>
                )}
              </div>

              <button
                onClick={handleBuy}
                className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-800 py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                شراء الباقة
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
