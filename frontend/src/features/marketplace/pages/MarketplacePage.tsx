import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api as axios } from '../../../shared/lib/axios';
import { useDebounce } from '../../../shared/hooks/useDebounce'; // Assuming this exists or will create inline

import { FilterSidebar } from '../components/FilterSidebar';
import { PlanCard } from '../components/PlanCard';
import { PlanDrawer } from '../components/PlanDrawer';

export function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [filters, setFilters] = useState<any>({
    sort: 'popular',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['plans', debouncedSearch, filters],
    queryFn: async ({ pageParam = 1 }) => {
      // Mocking the query structure to fit typical backend integration
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('q', debouncedSearch);
      if (filters.regions?.length) params.append('region', filters.regions[0]);
      if (filters.dataAmount)
        params.append('minData', filters.dataAmount.toString());
      if (filters.maxPrice)
        params.append('maxPrice', filters.maxPrice.toString());
      if (filters.validity)
        params.append('validity', filters.validity.toString());
      if (filters.speed?.length) params.append('speed', filters.speed[0]);
      if (filters.providers?.length)
        params.append('providers', filters.providers.join(','));
      params.append('sortBy', filters.sort);
      params.append('page', pageParam.toString());
      params.append('limit', '12');

      const response = await axios.get(`/plans?${params.toString()}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages)
        return lastPage.pagination.page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });

  // Extract all plans from pages
  const plans =
    data?.pages.flatMap((page) => page.data || page.plans || []) || [];

  // Dummy data fallback for UI testing in case API is empty/failing during development
  const dummyPlans = [
    {
      id: '1',
      countryName: 'تركيا',
      countryNameEn: 'Turkey',
      countryCode: 'TR',
      flag: '🇹🇷',
      dataAmount: 10,
      validityDays: 30,
      price: 15,
      isBestSeller: true,
      networkSpeed: '4G/5G',
    },
    {
      id: '2',
      countryName: 'أوروبا',
      countryNameEn: 'Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      dataAmount: 20,
      validityDays: 30,
      price: 25,
      isBestSeller: true,
      networkSpeed: '5G',
    },
    {
      id: '3',
      countryName: 'عالمي',
      countryNameEn: 'Global',
      countryCode: 'GLOBAL',
      flag: '🌍',
      dataAmount: -1,
      validityDays: 15,
      price: 12,
      isLimited: true,
      networkSpeed: '4G',
    },
    {
      id: '4',
      countryName: 'الإمارات',
      countryNameEn: 'UAE',
      countryCode: 'AE',
      flag: '🇦🇪',
      dataAmount: 3,
      validityDays: 7,
      price: 9,
      isNew: true,
      networkSpeed: '5G',
    },
    {
      id: '5',
      countryName: 'فرنسا',
      countryNameEn: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
      dataAmount: 50,
      validityDays: 30,
      price: 18,
      isBestSeller: true,
      networkSpeed: '4G/5G',
    },
    {
      id: '6',
      countryName: 'السعودية',
      countryNameEn: 'Saudi Arabia',
      countryCode: 'SA',
      flag: '🇸🇦',
      dataAmount: 5,
      validityDays: 15,
      price: 14,
      networkSpeed: '5G',
    },
  ];

  const displayPlans = plans.length > 0 ? plans : dummyPlans;

  const handleResetFilters = () => {
    setFilters({ sort: 'popular' });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).reduce(
    (acc: number, val: any) => {
      if (Array.isArray(val)) return acc + val.length;
      if (val !== undefined && val !== null && val !== '' && val !== 'popular')
        return acc + 1;
      return acc;
    },
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header & Mobile Filters Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              متجر الباقات
            </h1>
            <p className="text-slate-500">
              اختر خطة eSIM المناسبة لوجهتك واستمتع باتصال فوري.
            </p>
          </div>

          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-5 h-5" />
            الفلاتر ({activeFiltersCount})
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar (Search & Sort) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-4 z-30">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن الدولة أو المنطقة..."
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
                  value={filters.sort || 'popular'}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                >
                  <option value="popular">الأكثر مبيعاً</option>
                  <option value="price_asc">الأرخص أولاً</option>
                  <option value="price_desc">الأغلى أولاً</option>
                  <option value="newest">الأحدث</option>
                  <option value="rating">أعلى تقييم</option>
                </select>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                    بحث: {searchQuery}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-400"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
                {(filters.regions || []).map((r: string) => (
                  <span
                    key={r}
                    className="bg-cyan-100 text-cyan-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-2"
                  >
                    {r}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          regions: filters.regions.filter(
                            (id: string) => id !== r
                          ),
                        })
                      }
                    />
                  </span>
                ))}
                {/* Can add more chips here for other active filters */}
              </div>
            )}

            {/* Results Grid/List */}
            {isLoading ? (
              <div
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse flex flex-col h-[400px]"
                  >
                    <div className="h-48 bg-slate-200" />
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      <div className="h-6 bg-slate-200 rounded-full w-1/2" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-12 bg-slate-100 rounded-xl" />
                        <div className="h-12 bg-slate-100 rounded-xl" />
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full w-3/4 mt-auto" />
                      <div className="flex justify-between items-end mt-2">
                        <div className="h-8 bg-slate-200 rounded-md w-1/3" />
                        <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  عذراً، حدث خطأ
                </h3>
                <p className="text-slate-500">
                  لم نتمكن من جلب العروض. يرجى المحاولة مرة أخرى لاحقاً.
                </p>
              </div>
            ) : displayPlans.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-slate-500">
                  حاول تغيير الفلاتر أو كلمات البحث.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 text-cyan-600 font-bold hover:underline"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                >
                  {displayPlans.map((plan: any) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      viewMode={viewMode}
                      onClick={setSelectedPlan}
                    />
                  ))}
                </motion.div>

                {/* Infinite Scroll Trigger / Load More */}
                {hasNextPage && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-cyan-600 transition-all disabled:opacity-50"
                    >
                      {isFetchingNextPage ? 'جاري التحميل...' : 'تحميل المزيد'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plan Details Drawer */}
      <PlanDrawer
        plan={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto p-4 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-900">الفلاتر</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
