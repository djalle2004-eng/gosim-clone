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
import { Search, Activity, WifiOff } from 'lucide-react';

export default function AdminESimsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo(
    () => [
      {
        iccid: '8932432000000000012',
        user: 'ahmed@dz.com',
        provider: 'Airalo',
        dataUsage: '3.2',
        dataTotal: '10',
        connectedAt: '2026-04-01 10:00',
        status: 'ONLINE',
      },
      {
        iccid: '8932432000000000013',
        user: 'sarah@mail.com',
        provider: 'Airalo',
        dataUsage: '0',
        dataTotal: '5',
        connectedAt: '-',
        status: 'NOT_INSTALLED',
      },
      {
        iccid: '8932432000000000014',
        user: 'karim@gmail.com',
        provider: 'GTMobile',
        dataUsage: '1.0',
        dataTotal: '1.0',
        connectedAt: '2026-03-15 08:00',
        status: 'DEPLETED',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        header: 'رقم الشريحة (ICCID)',
        accessorKey: 'iccid',
        cell: (info: any) => (
          <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded text-sm">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'المستخدم / العميل',
        accessorKey: 'user',
        cell: (info: any) => (
          <span className="text-gray-300 text-sm">{info.getValue()}</span>
        ),
      },
      {
        header: 'المزود',
        accessorKey: 'provider',
        cell: (info: any) => (
          <span className="text-white font-bold text-xs bg-white/10 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'استهلاك البيانات',
        id: 'data',
        cell: (info: any) => (
          <div className="w-48 text-left" dir="ltr">
            <div className="flex justify-between text-xs mb-1 text-gray-400">
              <span>{info.row.original.dataUsage} GB</span>
              <span>{info.row.original.dataTotal} GB</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${info.row.original.status === 'DEPLETED' ? 'bg-red-500' : 'bg-cyan-500'}`}
                style={{
                  width: `${(Number(info.row.original.dataUsage) / Number(info.row.original.dataTotal)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ),
      },
      {
        header: 'الشبكة',
        accessorKey: 'status',
        cell: (info: any) => {
          const s = info.getValue();
          if (s === 'ONLINE')
            return (
              <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold">
                <Activity className="w-3 h-3" /> متصل
              </span>
            );
          if (s === 'DEPLETED')
            return (
              <span className="text-red-400 flex items-center gap-1 text-xs font-bold w-max px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20">
                <WifiOff className="w-3 h-3" /> استنفذت السعة
              </span>
            );
          return (
            <span className="text-gray-500 text-xs font-bold">غير مثبتة</span>
          );
        },
      },
      {
        header: 'تاريخ أول اتصال',
        accessorKey: 'connectedAt',
        cell: (info: any) => (
          <span className="text-gray-500 text-xs font-mono">
            {info.getValue()}
          </span>
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
      <div className="flex justify-between items-end gap-4 p-6 bg-card border border-white/5 rounded-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            مراقبة الـ eSIMs
          </h1>
          <p className="text-gray-400">
            شاهد بيانات الشبكة والاتصال لحظة بلحظة لجميع الشرائح النشطة.
          </p>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5 flex gap-4 items-center bg-[#181822]">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-gray-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              placeholder="بحث بـ ICCID أو البريد..."
              className="w-full bg-background border border-white/10 rounded-xl py-2 pr-10 pl-4 outline-none text-white focus:border-cyan-500/50 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse" dir="rtl">
            <thead className="bg-[#12121a]">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="py-4 px-6 text-gray-400 font-medium text-sm border-b border-white/5"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
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
                    <td key={cell.id} className="py-4 px-6 whitespace-nowrap">
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
      </div>
    </div>
  );
}
