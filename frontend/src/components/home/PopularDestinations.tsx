import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function PopularDestinations() {
  const navigate = useNavigate();
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries', 'popular'],
    queryFn: async () => {
      const res = await api.get('/countries/popular?currency=DZD');
      return res.data;
    },
  });

  return (
    <section className="py-24 bg-background" id="destinations">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              وجهات <span className="text-cyan-400">رائجة</span>
            </h2>
            <p className="text-gray-400">
              اكتشف أفضل باقات الإنترنت للبلدان الأكثر زيارة.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            عرض كل الدول <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white/5 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {countries?.slice(0, 12).map((country: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={country.id}
                onClick={() => navigate(`/plans?search=${country.nameEn}`)}
                className="group relative overflow-hidden rounded-2xl bg-card border border-white/5 p-5 cursor-pointer hover:border-cyan-500/50 transition-colors"
              >
                {/* Background Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-cyan-500/0 group-hover:from-violet-600/20 group-hover:to-cyan-500/20 transition-all duration-500"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300 origin-center block">
                      {country.flag}
                    </span>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {country.nameEn}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        من {Math.round(country.lowestPrice || 0)}{' '}
                        {country.displayCurrency || 'DZD'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <button className="flex md:hidden w-full items-center justify-center gap-2 mt-8 py-4 bg-white/5 rounded-xl text-cyan-400 font-medium active:bg-white/10 transition-colors">
          عرض كل الدول <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
