import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const REGION_COLORS: Record<string, string> = {
  EUROPE: 'from-blue-600/30 to-indigo-600/20',
  ASIA: 'from-amber-600/30 to-orange-600/20',
  AMERICAS: 'from-emerald-600/30 to-teal-600/20',
  MIDDLEEAST: 'from-rose-600/30 to-pink-600/20',
  AFRICA: 'from-yellow-600/30 to-amber-600/20',
  GLOBAL: 'from-violet-600/30 to-cyan-500/20',
};

const REGION_GLOW: Record<string, string> = {
  EUROPE: 'group-hover:shadow-blue-500/20',
  ASIA: 'group-hover:shadow-amber-500/20',
  AMERICAS: 'group-hover:shadow-emerald-500/20',
  MIDDLEEAST: 'group-hover:shadow-rose-500/20',
  AFRICA: 'group-hover:shadow-yellow-500/20',
  GLOBAL: 'group-hover:shadow-violet-500/20',
};

const REGION_BORDER: Record<string, string> = {
  EUROPE: 'group-hover:border-blue-500/40',
  ASIA: 'group-hover:border-amber-500/40',
  AMERICAS: 'group-hover:border-emerald-500/40',
  MIDDLEEAST: 'group-hover:border-rose-500/40',
  AFRICA: 'group-hover:border-yellow-500/40',
  GLOBAL: 'group-hover:border-violet-500/40',
};

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
    <section className="py-24 bg-background relative overflow-hidden" id="destinations">
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
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase">
                الوجهات الشعبية
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              وجهات <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">رائجة</span>
            </h2>
            <p className="text-gray-400 max-w-lg">
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
                className="h-36 bg-white/5 rounded-2xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {countries?.slice(0, 12).map((country: any, idx: number) => {
              const regionColor = REGION_COLORS[country.region] || REGION_COLORS.GLOBAL;
              const regionGlow = REGION_GLOW[country.region] || REGION_GLOW.GLOBAL;
              const regionBorder = REGION_BORDER[country.region] || REGION_BORDER.GLOBAL;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  key={country.id}
                  onClick={() => navigate(`/plans?search=${country.nameEn}`)}
                  className={`group relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5 cursor-pointer transition-all duration-500 hover:shadow-2xl ${regionGlow} ${regionBorder}`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${regionColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>

                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative">
                      <span className="text-4xl group-hover:scale-125 transition-transform duration-500 origin-center block filter group-hover:drop-shadow-lg">
                        {country.flag}
                      </span>
                      {/* Flag glow */}
                      <div className="absolute inset-0 text-4xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
                        {country.flag}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base md:text-lg truncate group-hover:text-white transition-colors">
                        {country.nameEn}
                      </h3>
                      <p className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors truncate">
                        {country.nameAr}
                      </p>
                    </div>
                  </div>

                  {/* Price badge */}
                  <div className="relative z-10 mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-gray-400 transition-colors">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[11px]">{country.region}</span>
                    </div>
                    <div className="bg-white/[0.06] group-hover:bg-white/10 px-3 py-1 rounded-full transition-colors">
                      <span className="text-cyan-400 text-xs font-bold">
                        من {Math.round(country.lowestPrice || 0)}{' '}
                        <span className="text-gray-500 font-normal">{country.displayCurrency || 'DZD'}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate('/plans')}
          className="flex md:hidden w-full items-center justify-center gap-2 mt-10 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 font-bold active:bg-white/10 transition-colors"
        >
          عرض كل الدول <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
