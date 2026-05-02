import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  Copy,
  Check,
  Share2,
  Users,
  DollarSign,
  Gift,
  MessageCircle,
  Link2,
  ExternalLink,
} from 'lucide-react';

const MOCK_REFERRALS = [
  {
    name: 'أحمد سعيد',
    email: 'ahmed@example.com',
    date: '2026-04-10',
    orders: 2,
    earned: 3.0,
  },
  {
    name: 'فاطمة زهراء',
    email: 'fatima@example.com',
    date: '2026-04-05',
    orders: 1,
    earned: 1.5,
  },
  {
    name: 'يوسف بوجمعة',
    email: 'youssef@example.com',
    date: '2026-03-28',
    orders: 3,
    earned: 4.5,
  },
];

export default function DashboardReferralPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = `REF-${(user?.id || '').slice(0, 6).toUpperCase()}`;
  const referralLink = `https://soufsim-web.onrender.com/register?ref=${referralCode}`;

  const totalEarned = MOCK_REFERRALS.reduce((s, r) => s + r.earned, 0);
  const pendingEarned = 1.5;
  const paidEarned = totalEarned - pendingEarned;

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    {
      label: 'عدد المُحالين',
      value: MOCK_REFERRALS.length,
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
    },
    {
      label: 'أرباح معلقة',
      value: `$${pendingEarned.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      label: 'أرباح محولة',
      value: `$${paidEarned.toFixed(2)}`,
      icon: Gift,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
  ];

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          برنامج الإحالة
        </h1>
        <p className="text-slate-500">ادعُ أصدقاءك واكسب عمولة على كل طلب.</p>
      </div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-xl text-white"
      >
        <div className="absolute top-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-violet-300" />
            <p className="text-violet-200 font-medium">رابط الإحالة الخاص بك</p>
          </div>
          <p className="text-3xl font-black mb-1">{referralCode}</p>
          <p className="text-violet-200 text-sm mb-6">
            احصل على <span className="text-white font-bold">$1.5</span> لكل صديق
            يُكمل طلبه الأول!
          </p>

          {/* Link box */}
          <div className="flex bg-white/10 border border-white/20 rounded-2xl overflow-hidden mb-4">
            <div className="flex items-center gap-2 flex-1 px-4 py-3">
              <Link2 className="w-4 h-4 text-violet-300 flex-shrink-0" />
              <span className="text-white/80 text-sm truncate font-mono">
                {referralLink}
              </span>
            </div>
            <button
              onClick={copy}
              className="bg-white/20 hover:bg-white/30 px-4 flex items-center gap-2 transition-colors font-bold text-sm"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'تم!' : 'نسخ'}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent('استخدم رابط الإحالة الخاص بي للحصول على خصم: ' + referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> واتساب
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('استخدم رابط الإحالة الخاص بي: ' + referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> تويتر
            </a>
            <button
              onClick={copy}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Share2 className="w-4 h-4" /> مشاركة
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
              <s.icon className={`w-5 h-5 ${s.text}`} />
            </div>
            <p className="text-slate-400 text-xs mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Referrals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">قائمة المُحالين</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-500">
                  الاسم
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-500">
                  تاريخ التسجيل
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-500">
                  عدد الطلبات
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-500">
                  العمولة المكتسبة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_REFERRALS.map((r, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{r.date}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold">
                      {r.orders}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600">
                    ${r.earned.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
