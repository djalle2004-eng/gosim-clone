import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  Ban,
  Mail,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCog,
  CheckSquare,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  country?: string;
  createdAt: string;
  _count?: { orders: number };
}

// ─── Mock data fallback ───────────────────────────────────────────────────────

const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `u${i}`,
  firstName: [
    'Ahmed',
    'Sara',
    'Mohammed',
    'Yasmine',
    'Carlos',
    'Liu',
    'Fatima',
    'James',
  ][i % 8],
  lastName: [
    'Bensalem',
    'Dupont',
    'Al-Rashid',
    'Cherif',
    'Ruiz',
    'Wei',
    'Zoubi',
    'Brown',
  ][i % 8],
  email: `user${i + 1}@example.com`,
  phone: `+213 5${Math.floor(Math.random() * 90000000 + 10000000)}`,
  role: ['USER', 'USER', 'USER', 'RESELLER', 'EMPLOYEE', 'ADMIN'][i % 6],
  isActive: i % 7 !== 0,
  country: ['Algeria', 'France', 'Saudi Arabia', 'UAE', 'Germany', 'UK'][i % 6],
  createdAt: new Date(
    Date.now() - Math.random() * 365 * 86400000
  ).toISOString(),
  _count: { orders: Math.floor(Math.random() * 20) },
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  EMPLOYEE: 'bg-sky-100 text-sky-700',
  RESELLER: 'bg-orange-100 text-orange-700',
  USER: 'bg-slate-100 text-slate-600',
};

function UserDetailModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const banMutation = useMutation({
    mutationFn: () => api.patch(`/admin/users/${user.id}/ban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
  });

  const changeRole = useMutation({
    mutationFn: (role: string) =>
      api.patch(`/admin/users/${user.id}/role`, { role }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=06b6d4&color=fff&size=80`}
            className="w-16 h-16 rounded-2xl"
            alt="avatar"
          />
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[user.role] || ROLE_BADGE.USER}`}
              >
                {user.role}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
              >
                {user.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Orders', value: user._count?.orders ?? 0 },
              { label: 'Country', value: user.country || '—' },
              {
                label: 'Member Since',
                value: new Date(user.createdAt).toLocaleDateString('en-GB'),
              },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-lg font-black text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Change Role */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Change Role
            </label>
            <div className="flex gap-2 flex-wrap">
              {['USER', 'RESELLER', 'EMPLOYEE', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => changeRole.mutate(role)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    user.role === role
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => banMutation.mutate()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
              <Ban className="w-4 h-4" />
              {user.isActive ? 'Suspend Account' : 'Reactivate Account'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const PAGE_SIZE = 15;

  const { data: apiUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/users');
        return res.data as User[];
      } catch {
        return MOCK_USERS;
      }
    },
    initialData: MOCK_USERS,
  });

  const filtered = useMemo(() => {
    return (apiUsers || MOCK_USERS).filter((u) => {
      const matchSearch =
        search === '' ||
        `${u.firstName} ${u.lastName} ${u.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [apiUsers, search, roleFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((u) => u.id)));
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Users Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {filtered.length.toLocaleString()} users total
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-slate-600"
        >
          <option value="ALL">All Roles</option>
          {['USER', 'RESELLER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-slate-600"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">
              {selectedIds.size} selected
            </span>
            <button className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100">
              <Ban className="w-3.5 h-3.5 inline mr-1" />
              Suspend
            </button>
            <button className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-100">
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Email
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-3 px-4 text-left">
                  <button
                    onClick={toggleAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  User
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  Role
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  Orders
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  Country
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  Joined
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-500">
                  Status
                </th>
                <th className="py-3 px-4 text-right font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-slate-50/50 transition-colors ${selectedIds.has(user.id) ? 'bg-cyan-50/50' : ''}`}
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded border-slate-300 text-cyan-500"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=40`}
                        className="w-9 h-9 rounded-xl"
                        alt="avatar"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_BADGE[user.role] || ROLE_BADGE.USER}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {user._count?.orders ?? '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {user.country || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
                      />
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
