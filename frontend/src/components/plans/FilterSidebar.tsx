import { useSearchParams } from 'react-router-dom';

export default function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // always reset pagination on filter change
    
    if (value === 'ANY' || value === '0') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const currentRegion = searchParams.get('region') || 'ANY';
  const currentData = searchParams.get('minData') || searchParams.get('unlimited') === 'true' ? 'unlimited' : 'ANY';
  const currentValidity = searchParams.get('validity') || 'ANY';
  const maxPrice = Number(searchParams.get('maxPrice')) || 100;

  return (
    <aside className="w-full bg-card border border-white/5 rounded-3xl p-6 lg:sticky lg:top-24 h-max">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white">تصفية النتائج</h3>
        {(searchParams.toString().length > 0) && (
          <button 
            onClick={() => setSearchParams(new URLSearchParams())} 
            className="text-cyan-400 text-sm font-medium hover:underline"
          >
            مسح الكل
          </button>
        )}
      </div>

      <div className="space-y-8">
        
        {/* Region */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">المنطقة</h4>
          <div className="flex flex-col gap-2">
            {['ANY', 'EUROPE', 'ASIA', 'AMERICAS', 'AFRICA', 'MIDDLEEAST', 'GLOBAL'].map(reg => (
              <label key={reg} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="region"
                  checked={currentRegion === reg}
                  onChange={() => updateFilter('region', reg)}
                  className="w-4 h-4 accent-cyan-500 bg-white/5 border-white/10"
                />
                <span className={`text-sm transition-colors ${currentRegion === reg ? 'text-cyan-400 font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {reg === 'ANY' ? 'الكل' : reg === 'MIDDLEEAST' ? 'الشرق الأوسط' : reg}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Amount */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">حجم البيانات</h4>
          <select 
            value={searchParams.get('unlimited') === 'true' ? 'unlimited' : searchParams.get('minData') || 'ANY'}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.delete('unlimited');
              if (e.target.value === 'ANY') params.delete('minData');
              else if (e.target.value === 'unlimited') { params.delete('minData'); params.set('unlimited', 'true'); }
              else params.set('minData', e.target.value);
              setSearchParams(params);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="ANY" className="bg-card">أي حجم</option>
            <option value="1" className="bg-card">1 GB</option>
            <option value="3" className="bg-card">3 GB</option>
            <option value="5" className="bg-card">5 GB</option>
            <option value="10" className="bg-card">10 GB</option>
            <option value="20" className="bg-card">20 GB</option>
            <option value="unlimited" className="bg-card">غير محدود</option>
          </select>
        </div>

        {/* Price Slider */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">السعر الأقصى: ${maxPrice === 100 ? '+100' : maxPrice}</h4>
          <input 
            type="range" 
            min="0" max="100" 
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full accent-cyan-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Validity */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">الصلاحية</h4>
          <div className="flex flex-wrap gap-2">
            {[ {v: 'ANY', l: 'الكل'}, {v: '7', l: '7 أيام'}, {v: '14', l: '14 يوم'}, {v: '30', l: '30 يوم'} ].map(val => (
              <button
                key={val.v}
                onClick={() => updateFilter('validity', val.v)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${currentValidity === val.v ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                {val.l}
              </button>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
