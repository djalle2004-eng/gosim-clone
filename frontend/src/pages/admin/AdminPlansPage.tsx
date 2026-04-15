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
  ServerCog,
  Check,
  X,
} from 'lucide-react';

export default function AdminPlansPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Mock Inventory Data
  const data = useMemo(
    () => [
      {
        id: '1',
        flag: '🇫🇷',
        name: 'فرنسا',
        dataAmount: '10',
        price: 2800,
        priceUsd: 19.9,
        providerPlanId: 'airalo_fr_10gb_30d',
        status: 'ACTIVE',
        isBestseller: true,
      },
      {
        id: '2',
        flag: '🇹🇷',
        name: 'تركيا',
        dataAmount: '5',
        price: 1200,
        priceUsd: 8.5,
        providerPlanId: 'airalo_tr_5gb_15d',
        status: 'ACTIVE',
        isBestseller: false,
      },
      {
        id: '3',
        flag: '🇦🇪',
        name: 'الإمارات',
        dataAmount: '1',
        price: 800,
        priceUsd: 5.0,
        providerPlanId: 'airalo_ae_1gb_7d',
        status: 'INACTIVE',
        isBestseller: false,
      },
      {
        id: '4',
        flag: '🇺🇸',
        name: 'الولايات المتحدة',
        dataAmount: 'UNLIMITED',
        price: 5400,
        priceUsd: 38.0,
        providerPlanId: 'airalo_us_unl_30d',
        status: 'ACTIVE',
        isBestseller: true,
      },
      {
        id: '5',
        flag: '🌏',
        name: 'آسيا المفتوحة',
        dataAmount: '20',
        price: 4200,
        priceUsd: 30.0,
        providerPlanId: 'airalo_asia_20gb_30d',
        status: 'ACTIVE',
        isBestseller: false,
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        header: 'الدولة',
        accessorKey: 'name',
        cell: (info: any) => (
          <div className="flex items-center gap-2">
            <span className="text-xl">{info.row.original.flag}</span>{' '}
            <span className="font-bold text-white">{info.getValue()}</span>
          </div>
        ),
      },
      {
        header: 'السعة',
        accessorKey: 'dataAmount',
        cell: (info: any) => (
          <span className="text-gray-300 font-mono text-sm">
            {info.getValue() === 'UNLIMITED'
              ? 'غير محدود'
              : `${info.getValue()} GB`}
          </span>
        ),
      },
      {
        header: 'السعر (DZD)',
        accessorKey: 'price',
        cell: (info: any) => (
          <span className="text-cyan-400 font-bold">{info.getValue()} د.ج</span>
        ),
      },
      {
        header: 'Airalo ID',
        accessorKey: 'providerPlanId',
        cell: (info: any) => (
          <span className="text-gray-500 font-mono text-xs max-w-[150px] truncate block">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'الحالة',
        accessorKey: 'status',
        cell: (info: any) =>
          info.getValue() === 'ACTIVE' ? (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
              مُفعل
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold">
              معطّل
            </span>
          ),
      },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-6 bg-card border border-white/5 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            إدارة الباقات والمخزون
          </h1>
          <p className="text-gray-400">
            تحكم كامل في الأسعار، التفعيل، ومزامنة المنتجات مع مزود الخدمة.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-background border border-white/10 hover:border-white/20 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <ServerCog className="w-4 h-4" /> مزامنة Airalo
          </button>
          <button className="flex items-center gap-2 bg-cyan-500 text-background font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" /> باقة جديدة
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#181822]">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              placeholder="ابحث عن دولة، باقة أو كود..."
              className="w-full bg-background border border-white/10 rounded-xl py-2 pr-10 pl-4 outline-none text-white focus:border-cyan-500/50 text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            {table.getPrePaginationRowModel().rows.length} باقة مسجلة
          </div>
        </div>

        {/* Tanstack React Table Engine rendering Tailwind UI */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#12121a]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-6 text-right text-gray-400 font-medium text-sm whitespace-nowrap cursor-pointer hover:text-white select-none group"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-end gap-1 flex-row-reverse">
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
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-4 px-6 text-right whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#12121a]">
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
            >
              السابق
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
            >
              التالي
            </button>
          </div>
          <span className="text-gray-500 text-sm">
            صفحة {table.getState().pagination.pageIndex + 1} من{' '}
            {table.getPageCount() || 1}
          </span>
        </div>
      </div>
    </div>
  );
}
