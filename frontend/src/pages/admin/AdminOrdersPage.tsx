import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { Search, Eye, Download, CreditCard, ChevronDown } from 'lucide-react';

export default function AdminOrdersPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo(() => [
    { id: 'ORD-9882', user: 'ahmed@dz.com', plan: 'فرنسا 10GB', amount: 2800, payment: 'CIB', status: 'COMPLETED', date: '2026-04-12 14:30' },
    { id: 'ORD-9881', user: 'sarah@mail.com', plan: 'تركيا 5GB', amount: 1200, payment: 'Stripe', status: 'PROCESSING', date: '2026-04-12 11:20' },
    { id: 'ORD-9880', user: 'karim@gmail.com', plan: 'الإمارات 1GB', amount: 800, payment: 'الذهبية', status: 'REFUNDED', date: '2026-04-11 18:05' },
    { id: 'ORD-9879', user: 'amine@test.com', plan: 'الولايات المتحدة (غير محدود)' , amount: 5400, payment: 'Stripe', status: 'COMPLETED', date: '2026-04-10 09:12' },
  ], []);

  const columns = useMemo(() => [
    { header: 'الطلب', accessorKey: 'id', cell: (info: any) => <span className="font-mono text-cyan-400 text-sm font-bold">{info.getValue()}</span> },
    { header: 'العميل', accessorKey: 'user', cell: (info: any) => <div className="text-white text-sm">{info.getValue()}</div> },
    { header: 'الباقة المشتراة', accessorKey: 'plan', cell: (info: any) => <div className="text-gray-300 text-sm max-w-[150px] truncate">{info.getValue()}</div> },
    { header: 'المبلغ', accessorKey: 'amount', cell: (info: any) => <span className="text-white font-bold">{info.getValue()} د.ج</span> },
    { header: 'طريقة الدفع', accessorKey: 'payment', cell: (info: any) => (
      <div className="flex items-center justify-end gap-1 text-gray-400 text-xs bg-white/5 px-2 py-1 rounded w-max ml-auto">
        <CreditCard className="w-3 h-3" /> {info.getValue()}
      </div>
    )},
    { header: 'الحالة', accessorKey: 'status', cell: (info: any) => {
        const s = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${s === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : s === 'PROCESSING' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
            {s}
          </span>
        );
    }},
    { header: 'التاريخ', accessorKey: 'date', cell: (info: any) => <span className="text-gray-500 text-xs font-mono">{info.getValue()}</span> },
    { id: 'actions', header: '', cell: () => (
        <button className="flex items-center gap-1 text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
          <Eye className="w-3 h-3" /> عرض
        </button>
      )
    }
  ], []);

  const table = useReactTable({ data, columns, state: { sorting, globalFilter }, onSortingChange: setSorting, onGlobalFilterChange: setGlobalFilter, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-6 bg-card border border-white/5 rounded-3xl shadow-lg mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">سجل الطلبات والمدفوعات</h1>
           <p className="text-gray-400">تابع المبيعات الجارية واصدار المبالغ المستردة للعملاء.</p>
        </div>
        <button className="flex items-center gap-2 bg-background border border-white/10 hover:border-white/20 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm">
           <Download className="w-4 h-4" /> تصدير (CSV)
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#181822]">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input value={globalFilter ?? ''} onChange={e => setGlobalFilter(e.target.value)} type="text" placeholder="بحث برقم الطلب، البريد الإلكتروني..." className="w-full bg-background border border-white/10 rounded-xl py-2 pr-10 pl-4 outline-none text-white focus:border-cyan-500/50 text-sm" />
          </div>
          <div className="flex gap-2">
            <select className="bg-background border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500/50 text-sm appearance-none pr-10 relative">
              <option value="">جميع الحالات</option>
              <option value="COMPLETED">مكتمل</option>
              <option value="PROCESSING">معالجة</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#12121a]">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>{hg.headers.map(h => (
                  <th key={h.id} className="py-4 px-6 text-right text-gray-400 font-medium text-sm whitespace-nowrap cursor-pointer hover:text-white" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}</tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">{row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-4 px-6 text-right whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
