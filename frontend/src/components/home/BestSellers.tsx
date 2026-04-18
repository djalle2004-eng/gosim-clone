import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Zap,
  Wifi,
  ShoppingCart,
  Star,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import CountryFlag from '../ui/CountryFlag';
import { getCountryImage } from '../../lib/country-images';

export default function BestSellers() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', 'popular'],
    queryFn: async () => {
      const res = await api.get('/plans/popular?currency=DZD');
      return res.data;
    },
  });

  return (
    <section className="py-24 relative overflow-hidden" id="bestsellers">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card to-background" />
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-end mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-violet-400 font-bold text-sm tracking-widest uppercase">
                الأكثر طلباً
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              الباقات{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                الأكثر مبيعاً
              </span>
            </h2>
            <p className="text-gray-400 max-w-lg">
              انضم لآلاف المسافرين واختر من باقاتنا المفضلة.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[420px] bg-white/5 rounded-3xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:grid-flow-row lg:overflow-visible no-scrollbar">
            {plans?.map((plan: any, idx: number) => {
              const bgImage = getCountryImage(
                plan.country?.code,
                plan.country?.region
              );

              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  key={plan.id}
                  className="min-w-[300px] lg:min-w-0 snap-start relative group flex flex-col"
                >
                  <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl relative overflow-hidden hover:border-violet-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col h-full group-hover:-translate-y-2">
                    {/* Dark gradient overlay for readability over the background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-40"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-[#0a0a0f]/80 to-[#0a0a0f]/40" />

                    {/* Top decorative gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                    {/* Popular Badge */}
                    <div className="absolute top-0 right-6 z-20">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-b-xl shadow-lg shadow-violet-500/30 flex items-center gap-1.5">
                          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                          الأكثر مبيعاً
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col h-full relative z-10">
                      {/* Country Header */}
                      <div className="flex items-center gap-4 mb-6 mt-4">
                        <div className="group-hover:scale-110 transition-transform duration-500">
                          <CountryFlag
                            code={plan.country?.code}
                            size="xl"
                            className="shadow-xl ring-2 ring-white/10"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white drop-shadow-md">
                            {plan.country?.nameEn}
                          </h3>
                          <p className="text-gray-400 text-sm">{plan.name}</p>
                        </div>
                      </div>

                      {/* Data stats */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 text-center border border-white/[0.05] group-hover:border-white/[0.08] transition-colors">
                          <span className="block text-gray-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                            البيانات
                          </span>
                          <span className="text-white font-black text-xl">
                            {plan.isUnlimited ? '∞' : plan.dataAmount}
                            <span className="text-gray-400 text-xs font-medium mr-1">
                              {plan.isUnlimited ? '' : 'GB'}
                            </span>
                          </span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 text-center border border-white/[0.05] group-hover:border-white/[0.08] transition-colors">
                          <span className="block text-gray-500 text-[11px] font-medium mb-1.5 uppercase tracking-wider">
                            الصلاحية
                          </span>
                          <span className="text-white font-black text-xl">
                            {plan.validity}
                            <span className="text-gray-400 text-xs font-medium mr-1">
                              يوم
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="flex flex-col gap-2.5 mb-6 flex-grow">
                        <li className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          شبكة {plan.speed}
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            <Wifi className="w-3.5 h-3.5" />
                          </div>
                          نقطة اتصال (Hotspot)
                        </li>
                      </ul>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="block text-gray-500 text-[11px] font-medium mb-0.5">
                            السعر
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              {plan.price}
                            </span>
                            <span className="text-sm font-bold text-cyan-400">
                              {plan.displayCurrency}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/checkout?planId=${plan.id}&qty=1`)
                          }
                          className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          اشتري
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/plans')}
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-bold transition-all hover:gap-3 bg-violet-500/5 border border-violet-500/20 px-8 py-3 rounded-full hover:bg-violet-500/10"
          >
            تصفح جميع الباقات <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
