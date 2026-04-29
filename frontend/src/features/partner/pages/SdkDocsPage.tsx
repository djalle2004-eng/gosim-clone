import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'Python', 'PHP', 'cURL'];

const CODE_SNIPPETS: Record<string, Record<string, string>> = {
  'List Plans': {
    JavaScript: `import axios from 'axios';

const response = await axios.get('https://api.gosim.dz/v1/partner/plans', {
  headers: {
    'X-API-Key': 'ak_live_YOUR_KEY',
    'Content-Type': 'application/json',
  },
  params: { page: 1, limit: 20 }
});

console.log(response.data);`,

    Python: `import requests

response = requests.get(
    'https://api.gosim.dz/v1/partner/plans',
    headers={
        'X-API-Key': 'ak_live_YOUR_KEY',
        'Content-Type': 'application/json',
    },
    params={'page': 1, 'limit': 20}
)

print(response.json())`,

    PHP: `<?php
$client = new \GuzzleHttp\Client();

$response = $client->get('https://api.gosim.dz/v1/partner/plans', [
    'headers' => [
        'X-API-Key' => 'ak_live_YOUR_KEY',
        'Content-Type' => 'application/json',
    ],
    'query' => ['page' => 1, 'limit' => 20]
]);

$data = json_decode($response->getBody(), true);`,

    cURL: `curl -X GET "https://api.gosim.dz/v1/partner/plans?page=1&limit=20" \\
  -H "X-API-Key: ak_live_YOUR_KEY" \\
  -H "Content-Type: application/json"`,
  },

  'Create Order': {
    JavaScript: `const response = await axios.post(
  'https://api.gosim.dz/v1/partner/orders',
  { planId: 'plan_xyz123', quantity: 1 },
  { headers: { 'X-API-Key': 'ak_live_YOUR_KEY' } }
);

const { orderId, status } = response.data.data;`,

    Python: `response = requests.post(
    'https://api.gosim.dz/v1/partner/orders',
    json={'planId': 'plan_xyz123', 'quantity': 1},
    headers={'X-API-Key': 'ak_live_YOUR_KEY'}
)

order = response.json()['data']`,

    PHP: `$response = $client->post('https://api.gosim.dz/v1/partner/orders', [
    'headers' => ['X-API-Key' => 'ak_live_YOUR_KEY'],
    'json' => ['planId' => 'plan_xyz123', 'quantity' => 1]
]);`,

    cURL: `curl -X POST "https://api.gosim.dz/v1/partner/orders" \\
  -H "X-API-Key: ak_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"planId":"plan_xyz123","quantity":1}'`,
  },

  'Get eSIM QR Code': {
    JavaScript: `const res = await axios.get(
  \`https://api.gosim.dz/v1/partner/esims/\${iccid}/qrcode\`,
  { headers: { 'X-API-Key': 'ak_live_YOUR_KEY' } }
);

const { qrCodeUrl } = res.data.data;`,

    Python: `res = requests.get(
    f'https://api.gosim.dz/v1/partner/esims/{iccid}/qrcode',
    headers={'X-API-Key': 'ak_live_YOUR_KEY'}
)
qr_url = res.json()['data']['qrCodeUrl']`,

    PHP: `$res = $client->get("https://api.gosim.dz/v1/partner/esims/{$iccid}/qrcode", [
    'headers' => ['X-API-Key' => 'ak_live_YOUR_KEY']
]);
$qrUrl = json_decode($res->getBody(), true)['data']['qrCodeUrl'];`,

    cURL: `curl "https://api.gosim.dz/v1/partner/esims/{iccid}/qrcode" \\
  -H "X-API-Key: ak_live_YOUR_KEY"`,
  },
};

export default function SdkDocsPage() {
  const [activeLang, setActiveLang] = useState('JavaScript');
  const [activeSnippet, setActiveSnippet] = useState('List Plans');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const snippetKeys = Object.keys(CODE_SNIPPETS);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentCode = CODE_SNIPPETS[activeSnippet]?.[activeLang] || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">SDK Documentation</h1>
        <p className="text-slate-400 mt-1">
          Ready-to-use code snippets to integrate GoSIM into your application.
        </p>
      </div>

      {/* Response Format */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">
          📦 Standard Response Format
        </h3>
        <div className="bg-[#0d0d14] rounded-xl p-4 relative">
          <button
            onClick={() =>
              handleCopy(
                `{\n  "success": true,\n  "data": { ... },\n  "meta": { "page": 1, "limit": 20, "total": 150 },\n  "requestId": "req_1234567890"\n}`,
                'format'
              )
            }
            className="absolute top-3 right-3 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
          >
            {copiedId === 'format' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <pre className="text-sm font-mono text-slate-300">{`{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 },
  "requestId": "req_1234567890"
}`}</pre>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl overflow-hidden">
        {/* Snippet selector + Language toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex gap-2 flex-wrap">
            {snippetKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveSnippet(key)}
                className={`text-sm px-4 py-1.5 rounded-full transition-all ${activeSnippet === key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${activeLang === lang ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <button
            onClick={() => handleCopy(currentCode, 'snippet')}
            className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 z-10"
          >
            {copiedId === 'snippet' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <pre className="p-6 text-sm font-mono text-slate-300 overflow-auto bg-[#0d0d14]">
            {currentCode.split('\n').map((line, i) => {
              const isComment =
                line.trim().startsWith('//') ||
                line.trim().startsWith('#') ||
                line.trim().startsWith('*');
              return (
                <div key={i}>
                  {isComment ? (
                    <span className="text-slate-600">{line}</span>
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(
                            /('.*?'|".*?")/g,
                            '<span style="color:#86efac">$1</span>'
                          )
                          .replace(
                            /\b(import|from|const|let|async|await|return|export)\b/g,
                            '<span style="color:#c084fc">$1</span>'
                          )
                          .replace(
                            /\b(\d+)\b/g,
                            '<span style="color:#fbbf24">$1</span>'
                          ),
                      }}
                    />
                  )}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Authentication Guide */}
      <div className="bg-[#111120] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">🔐 Authentication</h3>
        <p className="text-slate-400 text-sm mb-4">
          All API requests must include your API key in the request header:
        </p>
        <div className="bg-[#0d0d14] rounded-xl p-4 relative">
          <button
            onClick={() => handleCopy('X-API-Key: ak_live_YOUR_KEY', 'auth')}
            className="absolute top-3 right-3 text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
          >
            {copiedId === 'auth' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <code className="text-cyan-300 font-mono text-sm">
            X-API-Key: ak_live_YOUR_KEY
          </code>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-emerald-400 font-medium mb-1">✓ Correct</div>
            <code className="text-slate-400 text-xs">
              X-API-Key: ak_live_abc123
            </code>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-red-400 font-medium mb-1">✗ Incorrect</div>
            <code className="text-slate-400 text-xs">
              Authorization: Bearer ak_live_abc123
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
