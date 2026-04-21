import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { Search, ShieldAlert, MoreVertical, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    },
  });

  const createStaff = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/staff', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsModalOpen(false);
      setStaffForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
      });
    },
  });

  const columns = [
    {
      header: 'المستخدم',
      accessorKey: 'firstName',
      cell: (info: any) => {
        const u = info.row.original;

        let RoleBadge = null;
        if (u.role === 'SUPER_ADMIN')
          RoleBadge = (
            <span className="bg-purple-600 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-slate-800">
              مدير عام
            </span>
          );
        else if (u.role === 'ADMIN' || u.role === 'EMPLOYEE')
          RoleBadge = (
            <span className="bg-blue-600 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-slate-800">
              موظف
            </span>
          );
        else if (u.role === 'RESELLER')
          RoleBadge = (
            <span className="bg-orange-600 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-slate-800">
              موزع
            </span>
          );

        return (
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random`}
              className="w-10 h-10 rounded-full border border-slate-200"
              alt="avatar"
            />
            <div>
              <div className="text-slate-800 font-bold text-sm flex items-center gap-2">
                {u.firstName} {u.lastName}
                {RoleBadge}
              </div>
              <div className="text-slate-400 text-xs">{u.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'العمولة / الخصم (%)',
      accessorKey: 'discountRate',
      cell: (info: any) => {
        const u = info.row.original;
        if (u.role !== 'RESELLER')
          return <span className="text-slate-300">-</span>;

        return (
          <div className="flex items-center gap-2 justify-end">
            <input
              type="number"
              min="0"
              max="100"
              defaultValue={u.discountRate}
              onBlur={async (e) => {
                const val = parseFloat(e.target.value);
                if (val !== u.discountRate) {
                  try {
                    await api.patch(`/admin/users/${u.id}/discount`, {
                      discountRate: val,
                    });
                    queryClient.invalidateQueries({
                      queryKey: ['admin-users'],
                    });
                  } catch (err) {
                    alert('خطأ في تحديث الخصم');
                  }
                }
              }}
              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold text-cyan-600 outline-none focus:border-cyan-500"
            />
            <span className="text-slate-400 text-[10px]">%</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: (info: any) => {
        const u = info.row.original;
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                if (confirm('هل أنت متأكد من تغيير حالة الحساب؟')) {
                  await api.patch(`/admin/users/${u.id}/ban`);
                  queryClient.invalidateQueries({ queryKey: ['admin-users'] });
                }
              }}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="حظر / إلغاء حظر"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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
      <div className="flex justify-between items-end gap-4 p-6 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            إدارة قاعدة المستخدمين
          </h1>
          <p className="text-slate-500">
            التحكم في وصول المستخدمين، الصلاحيات، وعرض سجلات الحسابات.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-background font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> إضافة موظف / موزع
          </button>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-200/50 flex gap-4 items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-10 pl-4 outline-none text-slate-800 focus:border-cyan-500/50 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-slate-400">
              جاري التحميل...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="py-4 px-6 text-right text-slate-500 font-medium text-sm border-b border-slate-200/50"
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
                    className="hover:bg-slate-50/50 transition-colors"
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
          )}
        </div>
      </div>

      {/* CREATE STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              إضافة حساب إداري جديد
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createStaff.mutate(staffForm);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-xs mb-1">
                    الاسم
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800"
                    value={staffForm.firstName}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">
                    اللقب
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800"
                    value={staffForm.lastName}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-xs mb-1">
                  البريد الإلكتروني (تسجيل الدخول)
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-slate-500 text-xs mb-1">
                  كلمة المرور المؤقتة
                </label>
                <input
                  required
                  type="text"
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800"
                  value={staffForm.password}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-slate-500 text-xs mb-1">
                  صلاحيات الحساب
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800"
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, role: e.target.value })
                  }
                >
                  <option value="EMPLOYEE">موظف في الشركة (دعم فني)</option>
                  <option value="RESELLER">موزع (B2B)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={createStaff.isPending}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-background font-bold py-2.5 rounded-xl transition-colors"
                >
                  {createStaff.isPending ? 'جاري الإضافة...' : 'إنشاء الحساب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
