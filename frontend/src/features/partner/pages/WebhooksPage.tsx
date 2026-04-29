import { useState } from 'react';
import { Plus, Trash2, Play, CheckCircle, XCircle, Clock, X, Zap } from 'lucide-react';

const ALL_EVENTS = [
  { id: 'order.completed', label: 'order.completed', desc: 'Fired when an order is successfully paid and fulfilled' },
  { id: 'esim.activated', label: 'esim.activated', desc: 'Fired when a new eSIM is activated for use' },
  { id: 'esim.expired', label: 'esim.expired', desc: 'Fired when an eSIM data pack expires' },
  { id: 'payment.failed', label: 'payment.failed', desc: 'Fired when a payment attempt fails' },
];

const MOCK_WEBHOOKS = [
  {
    id: 'wh_1',
    url: 'https://myapp.com/webhooks/gosim',
    events: ['order.completed', 'esim.activated'],
    active: true,
    deliveries: [
      { id: 'd1', event: 'order.completed', status: 200, ts: '2 min ago', duration: '142ms', success: true },
      { id: 'd2', event: 'esim.activated', status: 200, ts: '1 hour ago', duration: '98ms', success: true },
      { id: 'd3', event: 'payment.failed', status: 500, ts: '3 hours ago', duration: '2001ms', success: false },
    ]
  }
];

export default function WebhooksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>('wh_1');
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<null | 'success' | 'fail'>(null);

  const toggleEvent = (e: string) => {
    setSelectedEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const handlePing = async () => {
    setPinging(true);
    await new Promise(r => setTimeout(r, 1500));
    setPinging(false);
    setPingResult('success');
    setTimeout(() => setPingResult(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Webhooks</h1>
          <p className="text-slate-400 mt-1">Receive real-time notifications when events happen in your account.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Endpoint
        </button>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        {MOCK_WEBHOOKS.map(wh => (
          <div key={wh.id} className="bg-[#111120] border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <button onClick={() => setExpanded(expanded === wh.id ? null : wh.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`w-2 h-2 rounded-full ${wh.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <code className="text-cyan-300 text-sm">{wh.url}</code>
                <div className="flex gap-1">
                  {wh.events.map(e => (
                    <span key={e} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePing(); }}
                  disabled={pinging}
                  className="flex items-center gap-1.5 text-xs bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {pinging ? <><Zap className="w-3 h-3 animate-pulse" /> Sending...</> : <><Play className="w-3 h-3" /> Test</>}
                </button>
                {pingResult === 'success' && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Delivered!</span>}
                <button className="text-slate-500 hover:text-red-400 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>

            {/* Delivery Logs */}
            {expanded === wh.id && (
              <div className="border-t border-white/5">
                <div className="px-5 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Delivery Logs</div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/2">
                      <th className="text-left text-xs text-slate-500 px-5 py-3">Event</th>
                      <th className="text-left text-xs text-slate-500 px-5 py-3">Status</th>
                      <th className="text-left text-xs text-slate-500 px-5 py-3">Duration</th>
                      <th className="text-left text-xs text-slate-500 px-5 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {wh.deliveries.map(d => (
                      <tr key={d.id} className="hover:bg-white/2">
                        <td className="px-5 py-3">
                          <code className="text-sm text-slate-300">{d.event}</code>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${d.success ? 'text-emerald-400' : 'text-red-400'}`}>
                            {d.success ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {d.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400 text-sm">{d.duration}</td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-1 text-slate-500 text-sm">
                            <Clock className="w-3 h-3" /> {d.ts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111120] border border-white/10 rounded-3xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Webhook Endpoint</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Endpoint URL *</label>
                <input
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://yourapp.com/webhooks"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-3">Events to Subscribe</label>
                <div className="space-y-2">
                  {ALL_EVENTS.map(ev => (
                    <label key={ev.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedEvents.includes(ev.id) ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/5 hover:border-white/10'}`}>
                      <input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={() => toggleEvent(ev.id)} className="accent-cyan-500" />
                      <div>
                        <code className="text-sm text-cyan-300">{ev.label}</code>
                        <p className="text-xs text-slate-500 mt-0.5">{ev.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 border border-white/10 text-slate-400 py-3 rounded-xl">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 bg-cyan-500 text-slate-900 font-bold py-3 rounded-xl">Create Endpoint</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
