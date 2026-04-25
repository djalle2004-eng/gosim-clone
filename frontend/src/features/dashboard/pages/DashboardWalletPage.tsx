import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard,
  Banknote, RefreshCw, CheckCircle2,
} from 'lucide-react';

const RATES = { USD: 1, DZD: 135, EUR: 0.92 };
type Currency = 'USD' | 'DZD' | 'EUR';

const MOCK_BALANCE_USD = 12.5;
const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit', amount: 20, currency: 'USD', date: '2026-04-20', ref: 'TOPUP-001', label: 'تعبئة رصيد' },
  { id: '2', type: 'debit',  amount: 7.5, currency: 'USD', date: '2026-04-18', ref: 'ORDER-8F2A', label: 'شراء باقة مصر' },
  { id: '3', type: 'credit', amount: 5,   currency: 'USD', date: '2026-04-15', ref: 'REF-BONUS', label: 'مكافأة إحالة' },
  { id: '4', type: 'debit',  amount: 14,  currency: 'USD', date: '2026-04-10', ref: 'ORDER-3C7B', label: 'شراء باقة الإمارات' },
];

const TOPUP_OPTIONS = [5, 10, 20, 50, 100];

export default function DashboardWalletPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [topupModal, setTopupModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [payMethod, setPayMethod] = useState<'card' | 'cib'>('card');
  const [success, setSuccess] = useState(false);

  const balance = MOCK_BALANCE_USD * RATES[currency];
  const symbol = currency === 'DZD' ? 'دج' : currency === 'EUR' ? '€' : '$';

  const handleTopup = () => {
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setTopupModal(false); }, 2500);
  };

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">محفظتي</h1>
        <p className="text-slate-500">إدارة رصيدك وسجل المعاملات.</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-xl"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-400 font-medium">الرصيد الحالي</span>
            </div>
            {/* Currency Toggle */}
            <div className="flex gap-1 bg-slate-700/60 rounded-xl p-1">
              {(['USD', 'DZD', 'EUR'] as Currency[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    currency === c ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-5xl font-black text-white mb-1">
            {balance.toLocaleString('ar-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-2xl text-slate-400 mr-2">{symbol}</span>
          </p>
          <p className="text-slate-400 text-sm mb-8">
            ≈ {(MOCK_BALANCE_USD * RATES.DZD).toFixed(0)} دج · {(MOCK_BALANCE_USD * RATES.EUR).toFixed(2)} €
          </p>

          <button
            onClick={() => setTopupModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5" />
            تعبئة الرصيد
          </button>
        </div>
      </motion.div>

      {/* Transactions */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">سجل المعاملات</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_TRANSACTIONS.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                tx.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {tx.type === 'credit'
                  ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                  : <ArrowUpRight className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{tx.label}</p>
                <p className="text-xs text-slate-400 font-mono">{tx.ref} · {tx.date}</p>
              </div>
              <span className={`font-bold text-base ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                {tx.type === 'credit' ? '+' : '-'}{(tx.amount * RATES[currency]).toFixed(2)} {symbol}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Topup Modal */}
      <AnimatePresence>
        {topupModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTopupModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-center text-white">
                <h3 className="font-bold text-lg">تعبئة الرصيد</h3>
                <p className="text-sm opacity-80">اختر المبلغ وطريقة الدفع</p>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-xl">تمت التعبئة بنجاح!</p>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">اختر المبلغ (USD)</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {TOPUP_OPTIONS.map(amt => (
                        <button
                          key={amt}
                          onClick={() => setSelectedAmount(amt)}
                          className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                            selectedAmount === amt
                              ? 'bg-cyan-500 text-white border-cyan-500 shadow'
                              : 'border-slate-200 text-slate-600 hover:border-cyan-300'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <span className="text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        value={selectedAmount || ''}
                        onChange={e => setSelectedAmount(Number(e.target.value))}
                        placeholder="أو أدخل مبلغاً مخصصاً"
                        className="bg-transparent flex-1 text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">طريقة الدفع</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'card', icon: CreditCard, label: 'بطاقة بنكية' },
                        { key: 'cib', icon: Banknote, label: 'دفع CIB' },
                      ].map(m => (
                        <button
                          key={m.key}
                          onClick={() => setPayMethod(m.key as 'card' | 'cib')}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                            payMethod === m.key
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          <m.icon className="w-4 h-4" />
                          <span className="font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleTopup}
                    disabled={!selectedAmount}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-2xl font-bold shadow-lg disabled:opacity-40 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    تعبئة ${selectedAmount || 0}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
