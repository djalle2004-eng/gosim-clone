import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Zap, Wifi } from 'lucide-react';

export default function BestSellers() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', 'popular'],
    queryFn: async () => {
      // Assuming server port 5000 is open based on previous backend logs
      const res = await fetch('http://localhost:5000/api/plans/popular?currency=DZD');
      if (!res.ok) throw new Error('Failed to fetch bestsellers');
      return res.json();
    }
  });

  return (
    <section className="py-24 bg-card" id="bestsellers">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">الباقات <span className="text-cyan-400">الأكثر مبيعاً</span></h2>
            <p className="text-gray-400">انضم لآلاف المسافرين واختر من باقاتنا المفضلة.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:grid-flow-row lg:overflow-visible no-scrollbar">
            {plans?.map((plan: any, idx: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={plan.id}
                className="min-w-[280px] lg:min-w-0 snap-start bg-background border border-white/10 rounded-3xl p-6 relative group hover:border-cyan-500/50 transition-all shadow-xl hover:-translate-y-2 flex flex-col"
              >
                {/* Popular Badge */}
                <div className="absolute -top-4 right-6 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  الأكثر مبيعاً 🔥
                </div>
                
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <span className="text-4xl">{plan.country?.flag}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.country?.nameEn}</h3>
                    <p className="text-gray-400 text-sm">{plan.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <span className="block text-gray-400 text-xs mb-1">البيانات</span>
                    <span className="text-white font-bold">{plan.isUnlimited ? 'غير محدود' : `${plan.dataAmount} GB`}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <span className="block text-gray-400 text-xs mb-1">الصلاحية</span>
                    <span className="text-white font-bold">{plan.validity} أيام</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 mb-6 flex-grow">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-cyan-400" /> شبكة {plan.speed}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Wifi className="w-4 h-4 text-cyan-400" /> نقطة اتصال (Hotspot)
                  </li>
                </ul>

                <hr className="border-white/10 mb-6" />

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="block text-gray-400 text-xs">السعر</span>
                    <span className="text-2xl font-bold text-white">
                      {plan.price} <span className="text-sm font-normal text-cyan-400">{plan.displayCurrency}</span>
                    </span>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                    اشتري الآن
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
