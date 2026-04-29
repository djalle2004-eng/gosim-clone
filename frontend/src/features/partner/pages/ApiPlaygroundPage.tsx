import { useState } from 'react';
import { Play, Copy, Check, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';

const ENDPOINTS = [
  { id: 'get-plans', method: 'GET', path: '/v1/partner/plans', label: 'List eSIM Plans', params: [{ name: 'page', type: 'number', default: '1' }, { name: 'limit', type: 'number', default: '20' }] },
  { id: 'get-plan', method: 'GET', path: '/v1/partner/plans/:id', label: 'Get Plan Details', params: [{ name: 'id', type: 'string', default: '' }] },
  { id: 'create-order', method: 'POST', path: '/v1/partner/orders', label: 'Create Order', params: [{ name: 'planId', type: 'string', default: '' }, { name: 'quantity', type: 'number', default: '1' }] },
  { id: 'get-esims', method: 'GET', path: '/v1/partner/esims', label: 'List eSIMs', params: [] },
  { id: 'get-balance', method: 'GET', path: '/v1/partner/balance', label: 'Get Wallet Balance', params: [] },
  { id: 'list-webhooks', method: 'GET', path: '/v1/partner/webhooks', label: 'List Webhooks', params: [] },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState('ak_live_YOUR_KEY_HERE');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    let path = selectedEndpoint.path;
    const bodyParams: Record<string, any> = {};

    selectedEndpoint.params.forEach(p => {
      const val = paramValues[p.name] ?? p.default;
      if (path.includes(`:${p.name}`)) {
        path = path.replace(`:${p.name}`, val);
      } else if (selectedEndpoint.method !== 'GET') {
        bodyParams[p.name] = p.type === 'number' ? Number(val) : val;
      }
    });

    const startTime = Date.now();
    try {
      const res = await (selectedEndpoint.method === 'GET'
        ? api.get(path, { headers: { 'X-API-Key': apiKey } })
        : api.post(path, bodyParams, { headers: { 'X-API-Key': apiKey } })
      );
      const duration = Date.now() - startTime;
      setResponse({ status: res.status, data: res.data, duration });
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(JSON.stringify(err.response?.data || { error: err.message }, null, 2));
      setResponse({ status: err.response?.status || 0, duration });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const responseStr = response?.data ? JSON.stringify(response.data, null, 2) : error || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">API Playground</h1>
        <p className="text-slate-400 mt-1">Test API requests directly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request Builder */}
        <div className="space-y-4">
          {/* API Key Input */}
          <div className="bg-[#111120] border border-white/5 rounded-2xl p-4">
            <label className="block text-xs text-slate-500 mb-2">X-API-Key Header</label>
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Endpoint Selector */}
          <div className="bg-[#111120] border border-white/5 rounded-2xl p-4 space-y-3">
            <label className="block text-xs text-slate-500">Endpoint</label>
            <div className="space-y-2">
              {ENDPOINTS.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => { setSelectedEndpoint(ep); setParamValues({}); setResponse(null); setError(null); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedEndpoint.id === ep.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 hover:border-white/10'}`}
                >
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                  <code className="text-sm text-slate-300 flex-1">{ep.path}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Params */}
          {selectedEndpoint.params.length > 0 && (
            <div className="bg-[#111120] border border-white/5 rounded-2xl p-4 space-y-3">
              <label className="block text-xs text-slate-500">Parameters</label>
              {selectedEndpoint.params.map(p => (
                <div key={p.name}>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    <code className="text-cyan-400">{p.name}</code>
                    <span className="text-slate-600 ml-2">{p.type}</span>
                  </label>
                  <input
                    value={paramValues[p.name] ?? p.default}
                    onChange={e => setParamValues(prev => ({ ...prev, [p.name]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    placeholder={p.default || `Enter ${p.name}`}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleRunRequest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold py-3.5 rounded-xl transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </div>

        {/* Right: Response */}
        <div className="bg-[#111120] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">Response</span>
              {response?.status && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {response.status}
                </span>
              )}
              {response?.duration && (
                <span className="text-xs text-slate-500">{response.duration}ms</span>
              )}
            </div>
            {responseStr && (
              <button onClick={() => handleCopy(responseStr)} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="flex-1 p-5 overflow-auto min-h-[400px]">
            {!responseStr && !loading && (
              <div className="flex items-center justify-center h-full text-slate-600">
                <div className="text-center">
                  <Play className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Send a request to see the response here.</p>
                </div>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
            {responseStr && (
              <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                {responseStr.split('\n').map((line, i) => {
                  const isKey = line.match(/^\s*"[\w]+":/);
                  const isString = line.match(/:\s*".*"/);
                  const isNumber = line.match(/:\s*\d+/);
                  const isBool = line.match(/:\s*(true|false)/);
                  return (
                    <div key={i}>
                      {isKey ? (
                        <span>
                          <span className="text-slate-400">{line.match(/(\s*")([^"]+)(":)/)?.[1]}</span>
                          <span className="text-cyan-300">{line.match(/(\s*")([^"]+)(":)/)?.[2]}</span>
                          <span className="text-slate-400">{line.match(/(\s*")([^"]+)(":)/)?.[3]}</span>
                          <span className={isString ? 'text-emerald-300' : isNumber ? 'text-amber-300' : isBool ? 'text-violet-300' : 'text-white'}>
                            {line.replace(/^\s*"[^"]+":/, '')}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-300">{line}</span>
                      )}
                    </div>
                  );
                })}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
