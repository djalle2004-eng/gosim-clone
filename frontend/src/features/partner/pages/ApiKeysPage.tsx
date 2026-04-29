import { useState } from 'react';
import { Plus, Copy, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ALL_SCOPES = [
  { id: 'plans:read', label: 'Plans — Read', desc: 'List and view eSIM plans' },
  { id: 'orders:create', label: 'Orders — Create', desc: 'Create and manage orders' },
  { id: 'orders:read', label: 'Orders — Read', desc: 'View order status and history' },
  { id: 'esims:read', label: 'eSIMs — Read', desc: 'View eSIM details and usage' },
  { id: 'esims:manage', label: 'eSIMs — Manage', desc: 'Top-up and manage eSIMs' },
  { id: 'webhooks:write', label: 'Webhooks — Write', desc: 'Create and delete webhooks' },
  { id: 'webhooks:read', label: 'Webhooks — Read', desc: 'View webhook delivery logs' },
];

// Mock data for display
const MOCK_KEYS = [
  { id: '1', name: 'Production Key', prefix: 'ak_live', scopes: ['plans:read', 'orders:create', 'esims:read'], lastUsedAt: '2 hours ago', active: true },
  { id: '2', name: 'Staging Key', prefix: 'ak_test', scopes: ['plans:read'], lastUsedAt: '3 days ago', active: true },
  { id: '3', name: 'Old Dev Key', prefix: 'ak_dev1', scopes: ['plans:read', 'orders:read'], lastUsedAt: '30 days ago', active: false },
];

interface CreateKeyForm {
  name: string;
  expiresAt?: string;
}

export default function ApiKeysPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['plans:read']);
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateKeyForm>();

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = (_data: CreateKeyForm) => {
    // Mock key creation
    const mockKey = `ak_live_${Math.random().toString(36).substring(2, 30)}`;
    setNewKeySecret(mockKey);
    setShowCreate(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-slate-400 mt-1">Manage your API keys and access credentials.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New API Key
        </button>
      </div>

      {/* Newly Created Key Alert */}
      {newKeySecret && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-400 mb-1">Save your API key now!</p>
              <p className="text-amber-300/70 text-sm mb-3">
                This is the <strong>only time</strong> your full API key will be shown. You cannot recover it later.
              </p>
              <div className="flex items-center gap-3 bg-[#0d0d14] rounded-xl p-3 font-mono text-sm">
                <code className="flex-1 text-cyan-300 break-all">{newKeySecret}</code>
                <button
                  onClick={() => handleCopyKey(newKeySecret)}
                  className="shrink-0 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={() => setNewKeySecret(null)} className="text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-slate-500 font-medium px-6 py-4">Name</th>
              <th className="text-left text-xs text-slate-500 font-medium px-6 py-4">Key</th>
              <th className="text-left text-xs text-slate-500 font-medium px-6 py-4">Scopes</th>
              <th className="text-left text-xs text-slate-500 font-medium px-6 py-4">Last Used</th>
              <th className="text-left text-xs text-slate-500 font-medium px-6 py-4">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_KEYS.map(key => (
              <tr key={key.id} className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-white">{key.name}</span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-cyan-400 text-sm bg-cyan-500/10 px-2 py-1 rounded">
                    {key.prefix}_••••••••
                  </code>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {key.scopes.slice(0, 2).map(s => (
                      <span key={s} className="text-xs bg-white/5 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                    {key.scopes.length > 2 && (
                      <span className="text-xs text-slate-500">+{key.scopes.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{key.lastUsedAt}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${key.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {key.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-500 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111120] border border-white/10 rounded-3xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New API Key</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Key Name *</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  placeholder="e.g. Production App"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Expiry Date (optional)</label>
                <input
                  type="date"
                  {...register('expiresAt')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Permissions (Scopes)</label>
                <div className="space-y-2">
                  {ALL_SCOPES.map(scope => (
                    <label key={scope.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedScopes.includes(scope.id) ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/5 hover:border-white/10'}`}>
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => toggleScope(scope.id)}
                        className="accent-cyan-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{scope.label}</div>
                        <div className="text-xs text-slate-500">{scope.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-white/10 text-slate-400 hover:text-white py-3 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-colors">
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
