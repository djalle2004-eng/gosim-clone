import { Wifi, Zap, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlanCardProps {
  plan: any;
  idx?: number;
}

export default function PlanCard({ plan, idx = 0 }: PlanCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-card border border-white/5 hover:border-cyan-500/40 transition-colors rounded-3xl p-6 relative group flex flex-col h-full shadow-lg hover:shadow-cyan-500/10"
    >
      {plan.isBestSeller && (
        <div className="absolute -top-3 left-6 shadow-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full z-10">
          الأكثر مبيعاً 🔥
        </div>
      )}

      <button className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors z-10 p-2 bg-white/5 rounded-full backdrop-blur-sm">
        <Bookmark className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl drop-shadow-md">{plan.country?.flag}</span>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{plan.country?.nameEn}</h3>
          <p className="text-gray-400 text-sm">{plan.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-background rounded-2xl p-4 flex justify-between items-center col-span-2 border border-white/5">
           <span className="text-gray-400 font-medium">البيانات</span>
           <span className="text-white font-black text-2xl tracking-tight">
             {plan.isUnlimited ? "غير محدود" : `${plan.dataAmount} GB`}
           </span>
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-white/5">
          <span className="block text-gray-500 text-xs mb-1">الصلاحية</span>
          <span className="text-white font-bold">{plan.validity} أيام</span>
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-white/5">
          <span className="block text-gray-500 text-xs mb-1">السرعة</span>
          <span className="text-cyan-400 font-bold">{plan.speed}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-grow">
        <li className="flex items-center gap-3 text-sm text-gray-300">
          <div className="p-1.5 rounded-md bg-white/5 text-cyan-400"><Zap className="w-3.5 h-3.5" /></div>
          اتصال فوري بالشريحة دون انتظار
        </li>
        <li className="flex items-center gap-3 text-sm text-gray-300">
          <div className="p-1.5 rounded-md bg-white/5 text-cyan-400"><Wifi className="w-3.5 h-3.5" /></div>
          دعم مشاركة الاتصال (Hotspot)
        </li>
      </ul>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-white leading-none">
            {plan.price}
          </span>
          <span className="text-cyan-400 font-bold text-sm mb-1">{plan.displayCurrency || 'DZD'}</span>
          
          <span className="text-gray-500 text-xs mb-1 mr-2 line-through">
            {Math.round(plan.price * 1.2)} {plan.displayCurrency || 'DZD'}
          </span>
        </div>
        
        <button className="w-full relative overflow-hidden group/btn bg-white/5 text-white py-4 rounded-xl font-bold transition-all border border-white/10 hover:border-transparent">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            شراء الباقة 
          </span>
        </button>
      </div>
    </motion.div>
  );
}
