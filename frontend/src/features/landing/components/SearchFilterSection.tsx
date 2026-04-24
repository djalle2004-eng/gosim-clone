import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function SearchFilterSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/plans?search=${encodeURIComponent(query)}`);
    }
  };

  const quickFilters = [
    { name: 'عالمي', icon: '🌍' },
    { name: 'أوروبا', icon: '🇪🇺' },
    { name: 'آسيا', icon: '🌏' },
    { name: 'أمريكا', icon: '🌎' },
    { name: 'أفريقيا', icon: '🌍' },
    { name: 'الشرق الأوسط', icon: '🕌' },
  ];

  const popularDestinations = [
    { name: 'فرنسا', flag: '🇫🇷' },
    { name: 'تركيا', flag: '🇹🇷' },
    { name: 'الإمارات', flag: '🇦🇪' },
    { name: 'أمريكا', flag: '🇺🇸' },
    { name: 'بريطانيا', flag: '🇬🇧' },
    { name: 'اليابان', flag: '🇯🇵' },
  ];

  return (
    <section className="relative -mt-16 z-30 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100">
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="relative flex items-center">
              <Search className="absolute right-6 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن الدولة أو المنطقة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-lg md:text-xl rounded-full py-5 pr-16 pl-6 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white transition-all border border-slate-200"
              />
              <button
                type="submit"
                className="absolute left-2 bg-slate-900 text-white rounded-full px-6 py-3 font-medium hover:bg-slate-800 transition-colors"
              >
                بحث
              </button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                تصفح حسب المنطقة
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => navigate(`/plans?region=${filter.name}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 text-slate-700 rounded-xl transition-colors text-sm font-medium"
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-3">
                الوجهات الشائعة
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => navigate(`/plans?search=${dest.name}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium"
                  >
                    <span>{dest.flag}</span>
                    <span>{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
