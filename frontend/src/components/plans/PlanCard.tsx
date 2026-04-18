import { Wifi, Zap, Bookmark, ShoppingCart, Check, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PlanCardProps {
  plan: any;
  idx?: number;
}

export default function PlanCard({ plan, idx = 0 }: PlanCardProps) {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate(`/checkout?planId=${plan.id}&qty=1`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="relative group flex flex-col h-full"
    >
      <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-500 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-cyan-500/10 group-hover:-translate-y-1">
        {/* Top accent line */}
        {plan.isBestSeller && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500" />
        )}

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Best seller badge */}
        {plan.isBestSeller && (
          <div className="absolute -top-0 left-6 z-10">
            <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-b-xl shadow-lg shadow-violet-500/30 flex items-center gap-1.5">
              🔥 الأكثر مبيعاً
            </div>
          </div>
        )}

        {/* Bookmark button */}
        <button className="absolute top-5 left-5 text-gray-600 hover:text-cyan-400 transition-colors z-10 p-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.06] backdrop-blur-sm">
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Country info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="relative">
            <span className="text-5xl drop-shadow-lg block group-hover:scale-110 transition-transform duration-500">
              {plan.country?.flag}
            </span>
            <div className="absolute inset-0 text-5xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
              {plan.country?.flag}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-0.5">
              {plan.country?.nameEn}
            </h3>
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {plan.name}
            </p>
          </div>
        </div>

        {/* Data highlight + stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-2xl p-4 flex justify-between items-center col-span-2 border border-cyan-500/10 group-hover:border-cyan-500/20 transition-colors">
            <span className="text-gray-400 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              البيانات
            </span>
            <span className="text-white font-black text-2xl tracking-tight">
              {plan.isUnlimited ? (
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">غير محدود</span>
              ) : (
                <>{plan.dataAmount} <span className="text-gray-400 text-sm font-medium">GB</span></>
              )}
            </span>
          </div>
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] rounded-xl p-3.5 text-center border border-white/[0.05] group-hover:border-white/[0.08] transition-colors">
            <span className="block text-gray-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">الصلاحية</span>
            <span className="text-white font-bold text-lg">{plan.validity} <span className="text-gray-500 text-xs">يوم</span></span>
          </div>
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] rounded-xl p-3.5 text-center border border-white/[0.05] group-hover:border-white/[0.08] transition-colors">
            <span className="block text-gray-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">السرعة</span>
            <span className="text-cyan-400 font-bold text-lg">{plan.speed}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2.5 mb-8 flex-grow relative z-10">
          <li className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" />
            </div>
            اتصال فوري بالشريحة دون انتظار
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            دعم مشاركة الاتصال (Hotspot)
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Check className="w-3.5 h-3.5" />
            </div>
            بدون رسوم إعداد
          </li>
        </ul>

        {/* Price & CTA */}
        <div className="relative z-10 mt-auto">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-none">
                {plan.price}
              </span>
              <span className="text-cyan-400 font-bold text-sm mb-0.5">
                {plan.displayCurrency || 'DZD'}
              </span>
              <span className="text-gray-600 text-xs mb-0.5 mr-2 line-through">
                {Math.round(plan.price * 1.2)} {plan.displayCurrency || 'DZD'}
              </span>
            </div>

            <button
              onClick={handleBuy}
              className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              شراء الباقة
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
