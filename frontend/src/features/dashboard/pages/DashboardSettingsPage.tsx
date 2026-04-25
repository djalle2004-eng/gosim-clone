import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  User, Lock, Shield, Monitor, Globe, Bell,
  Eye, EyeOff, Save, ChevronRight, Smartphone,
  LogOut, CheckCircle2,
} from 'lucide-react';

type Section = 'profile' | 'password' | '2fa' | 'devices' | 'preferences' | 'notifications';

const MOCK_DEVICES = [
  { id: '1', name: 'Chrome – Windows', location: 'الجزائر العاصمة', date: '2026-04-24', current: true },
  { id: '2', name: 'Safari – iPhone 15', location: 'وهران', date: '2026-04-20', current: false },
  { id: '3', name: 'Firefox – Ubuntu', location: 'قسنطينة', date: '2026-04-10', current: false },
];

const SECTIONS = [
  { key: 'profile' as Section, label: 'المعلومات الشخصية', icon: User },
  { key: 'password' as Section, label: 'كلمة المرور', icon: Lock },
  { key: '2fa' as Section, label: 'التحقق الثنائي (2FA)', icon: Shield },
  { key: 'devices' as Section, label: 'الأجهزة المسجلة', icon: Monitor },
  { key: 'preferences' as Section, label: 'التفضيلات', icon: Globe },
  { key: 'notifications' as Section, label: 'الإشعارات', icon: Bell },
];

export default function DashboardSettingsPage() {
  const { user } = useAuth();
  const [section, setSection] = useState<Section>('profile');
  const [showPass, setShowPass] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email_orders: true, email_promos: false, push_orders: true, push_promos: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">الإعدادات</h1>
        <p className="text-slate-500">إدارة حسابك وتفضيلاتك الشخصية.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-b border-slate-100 last:border-0 ${
                  section === s.key
                    ? 'bg-cyan-50 text-cyan-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${section === s.key ? 'bg-cyan-100' : 'bg-slate-100'}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                {s.label}
                <ChevronRight className={`w-4 h-4 mr-auto transition-transform ${section === s.key ? 'rotate-90 text-cyan-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* ── Profile Section ──────────────────────────────────────────── */}
            {section === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">المعلومات الشخصية</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img
                    src={`https://i.pravatar.cc/80?u=${user?.id}`}
                    alt="Avatar"
                    className="w-16 h-16 rounded-2xl border-2 border-cyan-200 shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                  </div>
                  <button className="mr-auto text-sm text-cyan-600 font-medium hover:text-cyan-700">تغيير الصورة</button>
                </div>
                <div className="grid gap-4">
                  {[
                    { label: 'الاسم الأول', key: 'firstName', value: user?.firstName },
                    { label: 'اسم العائلة', key: 'lastName', value: user?.lastName },
                    { label: 'البريد الإلكتروني', key: 'email', value: user?.email },
                    { label: 'رقم الهاتف', key: 'phone', value: '' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">{f.label}</label>
                      <input
                        defaultValue={f.value || ''}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={handleSave}
                  className={`mt-5 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:shadow-md'
                  }`}>
                  {saved ? <><CheckCircle2 className="w-4 h-4" /> تم الحفظ!</> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
                </button>
              </div>
            )}

            {/* ── Password Section ───────────────────────────────────────── */}
            {section === 'password' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">تغيير كلمة المرور</h2>
                <div className="grid gap-4 max-w-md">
                  {['كلمة المرور الحالية', 'كلمة المرور الجديدة', 'تأكيد كلمة المرور الجديدة'].map((label, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all pr-10"
                        />
                        <button onClick={() => setShowPass(!showPass)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave}
                  className="mt-5 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all">
                  <Lock className="w-4 h-4" /> تحديث كلمة المرور
                </button>
              </div>
            )}

            {/* ── 2FA Section ────────────────────────────────────────────── */}
            {section === '2fa' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2">التحقق الثنائي (2FA)</h2>
                <p className="text-slate-500 text-sm mb-6">أضف طبقة أمان إضافية لحسابك باستخدام تطبيق المصادقة.</p>
                <div className={`flex items-center justify-between p-4 rounded-2xl border mb-6 ${twoFAEnabled ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${twoFAEnabled ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      <Shield className={`w-5 h-5 ${twoFAEnabled ? 'text-emerald-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{twoFAEnabled ? 'مُفعَّل' : 'غير مُفعَّل'}</p>
                      <p className="text-xs text-slate-400">تحقق ثنائي عبر تطبيق المصادقة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${twoFAEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFAEnabled ? 'translate-x-6 left-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
                {twoFAEnabled && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-inner">
                        <Smartphone className="w-12 h-12 text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 mb-1">امسح رمز QR</p>
                        <p className="text-sm text-slate-500 mb-3">استخدم تطبيق Google Authenticator أو Authy لمسح الرمز.</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-cyan-600">
                          JBSWY3DPEHPK3PXP
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Devices Section ────────────────────────────────────────── */}
            {section === 'devices' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">الأجهزة المسجلة</h2>
                <div className="space-y-3">
                  {MOCK_DEVICES.map(d => (
                    <div key={d.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border ${d.current ? 'border-cyan-200 bg-cyan-50' : 'border-slate-200 bg-slate-50'}`}>
                      <Monitor className={`w-8 h-8 ${d.current ? 'text-cyan-500' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                          {d.name}
                          {d.current && <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">الجهاز الحالي</span>}
                        </p>
                        <p className="text-xs text-slate-400">{d.location} · {d.date}</p>
                      </div>
                      {!d.current && (
                        <button className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-medium transition-colors">
                          <LogOut className="w-3 h-3" /> تسجيل الخروج
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Preferences Section ────────────────────────────────────── */}
            {section === 'preferences' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">التفضيلات</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">العملة المفضلة</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-cyan-400">
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="DZD">دينار جزائري (DZD)</option>
                      <option value="EUR">يورو (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">اللغة</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none focus:border-cyan-400">
                      <option value="ar">العربية</option>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSave}
                  className="mt-5 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all">
                  {saved ? <><CheckCircle2 className="w-4 h-4" /> تم الحفظ!</> : <><Save className="w-4 h-4" /> حفظ التفضيلات</>}
                </button>
              </div>
            )}

            {/* ── Notifications Section ──────────────────────────────────── */}
            {section === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">إدارة الإشعارات</h2>
                <div className="space-y-3">
                  {[
                    { key: 'email_orders', label: 'تحديثات الطلبات', desc: 'إشعار بريدي عند تغيير حالة الطلب', icon: '📦' },
                    { key: 'email_promos', label: 'العروض والتخفيضات', desc: 'رسائل بريدية حول أحدث العروض', icon: '🎁' },
                    { key: 'push_orders', label: 'إشعارات الطلبات (Push)', desc: 'إشعار فوري عبر المتصفح', icon: '🔔' },
                    { key: 'push_promos', label: 'إشعارات الترويج (Push)', desc: 'عروض حصرية مباشرة على هاتفك', icon: '📢' },
                  ].map(item => (
                    <div key={item.key}
                      className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-700 text-sm">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-cyan-500' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5 left-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


