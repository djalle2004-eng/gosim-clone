import { useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />{' '}
        {/* Right arrow means previous in RTL */}
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold transition-colors ${
              currentPage === page
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-800 shadow-lg'
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> {/* Left arrow means next in RTL */}
      </button>
    </div>
  );
}
