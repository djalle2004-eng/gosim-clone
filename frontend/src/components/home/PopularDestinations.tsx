import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import CountryFlag from '../ui/CountryFlag';
import { getCountryImage } from '../../lib/country-images';

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
    <section
      className="py-24 bg-slate-50 relative overflow-hidden"
      id="destinations"
    >
      {/* Background decorations */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-between items-end mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Globe className="w-5 h-5 text-slate-800" />
              </div>
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">
                الوجهات الشعبية
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              وجهات{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                رائجة
              </span>
            </h2>
            <p className="text-slate-500 max-w-lg">
              اكتشف أفضل باقات الإنترنت للبلدان الأكثر زيارة.
            </p>
          </motion.div>
          <button
            onClick={() => navigate('/plans')}
            className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-all hover:gap-3 bg-cyan-500/5 border border-cyan-500/20 px-5 py-2.5 rounded-full hover:bg-cyan-500/10"
          >
            عرض كل الدول <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-44 bg-slate-100 rounded-3xl animate-pulse border border-slate-200/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {countries?.slice(0, 12).map((country: any, idx: number) => {
              const bgImage = getCountryImage(country.code, country.region);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  key={country.id}
                  onClick={() => navigate(`/plans?search=${country.nameEn}`)}
                  className="group relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 min-h-[180px] flex flex-col justify-end border border-slate-200"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />

                  {/* Dark gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-[#0a0a0f]/40 to-transparent group-hover:from-[#0a0a0f]/80 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-cyan-900/10 group-hover:bg-transparent transition-colors duration-500 mix-blend-overlay" />

                  <div className="relative z-10 flex items-center justify-between mb-4 mt-auto pt-6">
                    <div className="group-hover:scale-110 transition-transform duration-500 origin-bottom-left">
                      <CountryFlag
                        code={country.code}
                        size="xl"
                        className="shadow-2xl ring-2 ring-white/20"
                      />
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
                      <span className="text-slate-800 text-xs drop-shadow-md block text-center">
                        من{' '}
                        <span className="text-cyan-400 font-bold text-sm">
                          {Math.round(country.lowestPrice || 0)}
                        </span>{' '}
                        {country.displayCurrency || 'DZD'}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-800 font-black text-xl lg:text-2xl truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {country.nameEn}
                      </h3>
                      <p className="text-slate-800/80 font-medium text-xs truncate drop-shadow-md flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />{' '}
                        {country.nameAr}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate('/plans')}
          className="flex md:hidden w-full items-center justify-center gap-2 mt-10 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 font-bold active:bg-slate-200 transition-colors"
        >
          عرض كل الدول <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
