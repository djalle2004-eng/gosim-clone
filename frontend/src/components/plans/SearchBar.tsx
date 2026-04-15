import { useState, useEffect } from 'react';
import { Search, History, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gosim_recent_searches');
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  const handleSearch = (val: string) => {
    if (!val.trim()) return;
    
    // Save to local storage safely
    const newRecent = [val, ...recent.filter(item => item !== val)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('gosim_recent_searches', JSON.stringify(newRecent));

    // Update URL Params explicitly
    const newParams = new URLSearchParams(searchParams);
    newParams.set('q', val);
    newParams.set('page', '1'); // reset pagination on new search
    setSearchParams(newParams);
    setIsFocused(false);
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem('gosim_recent_searches');
  };

  return (
    <div className="relative z-30 max-w-2xl mx-auto w-full">
      <div className="relative">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="ابحث عن دولة أو منطقة..."
          className="w-full bg-card border border-white/10 focus:border-cyan-500 rounded-2xl py-4 pr-12 pl-4 text-white text-lg outline-none transition-all placeholder:text-gray-500 shadow-xl"
        />
        <button 
          onClick={() => handleSearch(query)}
          className="absolute inset-y-2 left-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 rounded-xl font-bold hover:shadow-cyan-500/25 transition-shadow"
        >
          بحث
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && recent.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
          <div className="px-4 py-2 flex justify-between items-center border-b border-white/5 mb-2">
            <span className="text-gray-400 text-sm">عمليات البحث الأخيرة</span>
            <button onClick={clearRecent} className="text-xs text-gray-500 hover:text-white transition-colors">مسح</button>
          </div>
          <ul>
            {recent.map((item, idx) => (
              <li 
                key={idx} 
                onClick={() => { setQuery(item); handleSearch(item); }}
                className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 text-white transition-colors"
              >
                <History className="w-4 h-4 text-gray-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
