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
import { Search, Mail, ShieldAlert, MoreVertical } from 'lucide-react';

export default function AdminUsersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo(
    () => [
      {
        id: '1',
        name: 'أحمد بن علي',
        email: 'ahmed@dz.com',
        avatar: 'https://i.pravatar.cc/150?u=ahmed',
        joined: '2025-11-20',
        orders: 4,
        status: 'ACTIVE',
        role: 'USER',
      },
      {
        id: '2',
        name: 'سارة خالد',
        email: 'sarah@mail.com',
        avatar: 'https://i.pravatar.cc/150?u=sar',
        joined: '2026-01-15',
        orders: 1,
        status: 'ACTIVE',
        role: 'USER',
      },
      {
        id: '3',
        name: 'كريم مصطفى',
        email: 'karim@gmail.com',
        avatar: 'https://i.pravatar.cc/150?u=karim',
        joined: '2026-03-02',
        orders: 0,
        status: 'BANNED',
        role: 'USER',
      },
      {
        id: '4',
        name: 'إدارة النظام',
        email: 'admin@gosim.dz',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        joined: '2024-01-01',
        orders: 99,
        status: 'ACTIVE',
        role: 'ADMIN',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        header: 'المستخدم',
        accessorKey: 'name',
        cell: (info: any) => (
          <div className="flex items-center gap-3">
            <img
              src={info.row.original.avatar}
              className="w-10 h-10 rounded-full border border-white/10"
              alt="avatar"
            />
            <div>
              <div className="text-white font-bold text-sm flex items-center gap-2">
                {info.getValue()}
                {info.row.original.role === 'ADMIN' && (
                  <span className="bg-violet-600 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-white">
                    مدير
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-xs">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: 'تاريخ الانضمام',
        accessorKey: 'joined',
        cell: (info: any) => (
          <span className="text-gray-400 text-sm">{info.getValue()}</span>
        ),
      },
      {
        header: 'إجمالي الطلبات',
        accessorKey: 'orders',
        cell: (info: any) => (
          <span className="text-white font-mono bg-white/5 py-1 px-3 rounded-lg border border-white/5">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'حالة الحساب',
        accessorKey: 'status',
        cell: (info: any) =>
          info.getValue() === 'ACTIVE' ? (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
              نشط
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold flex w-max gap-1 items-center">
              <ShieldAlert className="w-3 h-3" /> محظور
            </span>
          ),
      },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex justify-end gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
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
      <div className="flex justify-between items-end gap-4 p-6 bg-card border border-white/5 rounded-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            إدارة قاعدة المستخدمين
          </h1>
          <p className="text-gray-400">
            التحكم في وصول المستخدمين وعرض سجلات الشراء المرتبطة.
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
              placeholder="بحث بالاسم أو البريد..."
              className="w-full bg-background border border-white/10 rounded-xl py-2 pr-10 pl-4 outline-none text-white focus:border-cyan-500/50 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#12121a]">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="py-4 px-6 text-right text-gray-400 font-medium text-sm border-b border-white/5"
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
      </div>
    </div>
  );
}
