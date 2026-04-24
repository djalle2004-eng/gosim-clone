import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  setFilters,
  onReset,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    regions: true,
    data: true,
    validity: true,
    speed: true,
    price: true,
    provider: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const activeFiltersCount = Object.values(filters).reduce(
    (acc: number, val: any) => {
      if (Array.isArray(val)) return acc + val.length;
      if (val !== undefined && val !== null && val !== '') return acc + 1;
      return acc;
    },
    0
  );

  const regions = [
    { id: 'GLOBAL', label: 'عالمي', flag: '🌍' },
    { id: 'EUROPE', label: 'أوروبا', flag: '🇪🇺' },
    { id: 'ASIA', label: 'آسيا', flag: '🌏' },
    { id: 'AMERICAS', label: 'الأمريكيتين', flag: '🌎' },
    { id: 'AFRICA', label: 'أفريقيا', flag: '🌍' },
    { id: 'MIDDLE_EAST', label: 'الشرق الأوسط', flag: '🐪' },
  ];

  const providers = ['Airalo', 'eSIMGO', 'SIMFONY'];

  const handleRegionToggle = (regionId: string) => {
    const current = filters.regions || [];
    const updated = current.includes(regionId)
      ? current.filter((id: string) => id !== regionId)
      : [...current, regionId];
    setFilters({ ...filters, regions: updated });
  };

  const handleProviderToggle = (provider: string) => {
    const current = filters.providers || [];
    const updated = current.includes(provider)
      ? current.filter((p: string) => p !== provider)
      : [...current, provider];
    setFilters({ ...filters, providers: updated });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          الفلاتر
          {activeFiltersCount > 0 && (
            <span className="bg-cyan-100 text-cyan-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> إعادة تعيين
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Regions */}
        <div>
          <button
            onClick={() => toggleSection('regions')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-3"
          >
            المنطقة الجغرافية
            {openSections.regions ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.regions && (
            <div className="space-y-2">
              {regions.map((region) => (
                <label
                  key={region.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer w-5 h-5 appearance-none border-2 border-slate-200 rounded-md checked:bg-cyan-500 checked:border-cyan-500 transition-colors"
                      checked={(filters.regions || []).includes(region.id)}
                      onChange={() => handleRegionToggle(region.id)}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L4.5 8.5L13 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                    <span>{region.flag}</span> {region.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Data Amount */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => toggleSection('data')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4"
          >
            كمية البيانات
            {openSections.data ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.data && (
            <div>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full accent-cyan-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                value={filters.dataAmount || 0}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataAmount: parseInt(e.target.value),
                  })
                }
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>الكل</span>
                <span>
                  {filters.dataAmount === 100
                    ? 'غير محدود'
                    : `${filters.dataAmount || 0} GB+`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Validity */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => toggleSection('validity')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4"
          >
            مدة الصلاحية
            {openSections.validity ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.validity && (
            <div>
              <input
                type="range"
                min="1"
                max="365"
                className="w-full accent-blue-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                value={filters.validity || 1}
                onChange={(e) =>
                  setFilters({ ...filters, validity: parseInt(e.target.value) })
                }
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>يوم واحد</span>
                <span>
                  {filters.validity === 365
                    ? 'سنة كاملة'
                    : `${filters.validity || 1} يوم+`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4"
          >
            السعر الأقصى
            {openSections.price ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.price && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-slate-500">$0</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  className="flex-1 accent-emerald-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  value={filters.maxPrice || 200}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: parseInt(e.target.value),
                    })
                  }
                />
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-16 pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center outline-none focus:border-emerald-500"
                    value={filters.maxPrice || 200}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speed */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => toggleSection('speed')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-3"
          >
            سرعة الشبكة
            {openSections.speed ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.speed && (
            <div className="flex gap-2">
              {['4G', '5G'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    const current = filters.speed || [];
                    const updated = current.includes(speed)
                      ? current.filter((s: string) => s !== speed)
                      : [...current, speed];
                    setFilters({ ...filters, speed: updated });
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    (filters.speed || []).includes(speed)
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Provider */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => toggleSection('provider')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 mb-3"
          >
            مزود الخدمة
            {openSections.provider ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {openSections.provider && (
            <div className="space-y-2">
              {providers.map((provider) => (
                <label
                  key={provider}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer w-5 h-5 appearance-none border-2 border-slate-200 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-colors"
                      checked={(filters.providers || []).includes(provider)}
                      onChange={() => handleProviderToggle(provider)}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L4.5 8.5L13 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                    {provider}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
