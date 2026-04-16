import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpDown,
  Globe,
  Star,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCountriesPage() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    code: '',
    flag: '',
    region: 'EUROPE',
    isPopular: false,
    isActive: true,
  });

  // Fetch Countries
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['admin-countries'],
    queryFn: async () => {
      const res = await api.get('/admin/countries');
      return res.data;
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/countries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/admin/countries/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/countries/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-countries'] }),
  });

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      code: '',
      flag: '',
      region: 'EUROPE',
      isPopular: false,
      isActive: true,
    });
    setEditingCountry(null);
  };

  const handleEdit = (country: any) => {
    setEditingCountry(country);
    setFormData({
      nameEn: country.nameEn,
      nameAr: country.nameAr || '',
      code: country.code,
      flag: country.flag || '',
      region: country.region,
      isPopular: country.isPopular,
      isActive: country.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCountry) {
      updateMutation.mutate({ id: editingCountry.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'الدولة',
        accessorKey: 'nameEn',
        cell: (info: any) => (
          <div className="flex items-center gap-3">
            <span className="text-2xl drop-shadow-sm">
              {info.row.original.flag}
            </span>
            <div>
              <div className="font-bold text-white">{info.getValue()}</div>
              <div className="text-xs text-gray-400 font-mono">
                {info.row.original.code}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: 'الاسم بالعربية',
        accessorKey: 'nameAr',
        cell: (info: any) => (
          <span className="text-gray-300 font-medium">
            {info.getValue() || '-'}
          </span>
        ),
      },
      {
        header: 'المنطقة',
        accessorKey: 'region',
        cell: (info: any) => (
          <span className="px-3 py-1 bg-white/5 border border-white/5 text-gray-300 rounded-lg text-xs font-medium">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'رائج',
        accessorKey: 'isPopular',
        cell: (info: any) =>
          info.getValue() ? (
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ) : (
            <Star className="w-5 h-5 text-gray-700" />
          ),
      },
      {
        header: 'الحالة',
        accessorKey: 'isActive',
        cell: (info: any) =>
          info.getValue() ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Check className="w-3 h-3" /> نشط
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              <X className="w-3 h-3" /> معطل
            </span>
          ),
      },
      {
        id: 'actions',
        header: '',
        cell: (info: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-2 bg-white/5 hover:bg-violet-500/20 hover:text-violet-400 rounded-lg text-gray-400 transition-all border border-transparent hover:border-violet-500/20"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من تعطيل هذه الدولة؟')) {
                  deleteMutation.mutate(info.row.original.id);
                }
              }}
              className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg text-red-500 transition-all border border-transparent hover:border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: countries,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-8 bg-card border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            إدارة الدول والوجهات
          </h1>
          <p className="text-gray-400">
            تخصيص الدول، الأعلام، الأقاليم، والتحكم في ظهورها للعملاء.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="relative z-10 flex items-center gap-2 bg-cyan-500 text-background font-black px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> دولة جديدة
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181822]/50 backdrop-blur-md">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              placeholder="ابحث عن اسم الدولة أو الكود (ISO)..."
              className="w-full bg-background border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pr-11 pl-4 outline-none text-white text-sm transition-all"
            />
          </div>
          <div className="text-sm font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-xl">
            {table.getPrePaginationRowModel().rows.length} دولة مسجلة
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-[#12121a]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-5 px-8 text-right text-gray-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white select-none group border-b border-white/5"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-end gap-2 flex-row-reverse">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                          ),
                          desc: (
                            <ArrowUpDown className="w-3 h-3 text-cyan-400 rotate-180" />
                          ),
                        }[header.column.getIsSorted() as string] ??
                          (header.column.getCanSort() && (
                            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={100} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">
                      جاري تحميل البيانات...
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/[0.02] transition-colors group/row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-5 px-8 text-right whitespace-nowrap border-b border-white/[0.02]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination logic inherited from Admin Pattern */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#12121a]/50">
          <div className="flex gap-3">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl text-white text-sm font-bold transition-all border border-white/5"
            >
              السابق
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl text-white text-sm font-bold transition-all border border-white/5"
            >
              التالي
            </button>
          </div>
          <span className="text-gray-500 text-sm font-bold">
            صفحة {table.getState().pagination.pageIndex + 1} من{' '}
            {table.getPageCount() || 1}
          </span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-cyan-500" />

              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {editingCountry ? (
                    <Edit2 className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                {editingCountry ? 'تعديل بيانات الدولة' : 'إضافة دولة جديدة'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">
                      الاسم (EN)
                    </label>
                    <input
                      required
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      className="w-full bg-background border border-white/5 focus:border-cyan-500/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all"
                      placeholder="e.g. France"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">
                      الاسم (AR)
                    </label>
                    <input
                      required
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      className="w-full bg-background border border-white/5 focus:border-cyan-500/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all text-right"
                      placeholder="مثال: فرنسا"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">
                      الكود (ISO 2)
                    </label>
                    <input
                      required
                      maxLength={2}
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full bg-background border border-white/5 focus:border-cyan-500/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all font-mono"
                      placeholder="e.g. FR"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">
                      العلم (Emoji)
                    </label>
                    <input
                      required
                      value={formData.flag}
                      onChange={(e) =>
                        setFormData({ ...formData, flag: e.target.value })
                      }
                      className="w-full bg-background border border-white/5 focus:border-cyan-500/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all text-center text-2xl"
                      placeholder="🇫🇷"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 mr-1">
                      الإقليم / القارة
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      className="w-full bg-background border border-white/5 focus:border-cyan-500/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all appearance-none"
                    >
                      {[
                        'EUROPE',
                        'ASIA',
                        'AMERICAS',
                        'AFRICA',
                        'MIDDLEEAST',
                        'GLOBAL',
                      ].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-8 md:pt-8 pr-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPopular: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-white/10 bg-background checked:bg-yellow-500"
                      />
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                        دولة رائجة
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-white/10 bg-background checked:bg-emerald-500"
                      />
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                        تفعيل
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'جاري الحفظ...'
                      : editingCountry
                        ? 'حفظ التغييرات'
                        : 'إضافة الدولة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
