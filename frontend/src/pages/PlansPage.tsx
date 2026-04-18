import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/plans/SearchBar';
import FilterSidebar from '../components/plans/FilterSidebar';
import PlanCard from '../components/plans/PlanCard';
import Pagination from '../components/plans/Pagination';
import { useState } from 'react';
import { api } from '../lib/api';

export default function PlansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Directly pass the safe URL queries string natively into the backend!
  const queryDependencyString = searchParams.toString();

  const { data, isLoading } = useQuery({
    queryKey: ['plans-list', queryDependencyString],
    queryFn: async () => {
      // Pass the currency dynamically
      const res = await api.get(`/plans?${queryDependencyString}&currency=DZD`);
      return res.data;
    },
  });

  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (k) => k !== 'page' && k !== 'sortBy'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">
              اكتشف باقات الإنترنت
            </h1>
            <SearchBar />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar Planner */}
            <div className="hidden lg:block w-[300px] shrink-0">
              <FilterSidebar />
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-slate-800 font-bold">
                    {isLoading
                      ? 'جاري البحث...'
                      : `تم العثور على ${data?.pagination?.total || 0} باقة`}
                  </span>

                  {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg text-sm border border-cyan-500/20">
                      <Filter className="w-4 h-4" />
                      {activeFiltersCount} فلاتر نشطة
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Trigger */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 px-4 py-2 rounded-xl"
                  >
                    <Filter className="w-4 h-4" /> فلاتر
                  </button>

                  <select
                    value={searchParams.get('sortBy') || 'popular'}
                    onChange={(e) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('sortBy', e.target.value);
                      setSearchParams(params);
                    }}
                    className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 outline-none focus:border-cyan-500"
                  >
                    <option value="popular">الأكثر مبيعاً</option>
                    <option value="price_asc">السعر: من الأقل للأعلى</option>
                    <option value="price_desc">السعر: من الأعلى للأقل</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
              </div>

              {/* Grid / Empty States / Skeletons */}
              {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[450px] bg-slate-100 rounded-3xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : data?.data && data.data.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.data.map((plan: any, idx: number) => (
                      <PlanCard key={plan.id} plan={plan} idx={idx} />
                    ))}
                  </div>

                  <Pagination totalPages={data.pagination.pages} />
                </>
              ) : (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-12 text-center py-32">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    لا توجد نتائج مطابقة
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    لم نعثر على أي باقات إنترنت تتطابق مع فلاتر البحث الحالية.
                    جرب تغيير بعض الفلاتر لرؤية المزيد من النتائج.
                  </p>
                  <button
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="bg-slate-200 hover:bg-white/20 text-slate-800 px-8 py-3 rounded-xl font-bold transition-colors"
                  >
                    مسح جميع الفلاتر
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Sticky Filter Bottom Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-slate-50 z-50 rounded-t-3xl border-t border-slate-200 p-4 lg:hidden"
            >
              <div className="flex justify-between items-center mb-6 pt-2">
                <h3 className="text-xl font-bold text-slate-800">تصفية النتائج</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />

              <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur pt-4 pb-2 mt-8 border-t border-slate-200/50">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-800 py-4 rounded-xl font-bold"
                >
                  تطبيق الفلاتر وعرض النتائج
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
