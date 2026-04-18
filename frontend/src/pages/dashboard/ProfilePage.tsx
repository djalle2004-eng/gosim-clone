import { Camera, Save, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'أحمد بن علي',
    email: 'ahmed@dz.com',
    phone: '+213 550 123 456',
    country: 'الجزائر',
    currency: 'DZD',
    lang: 'ar',
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">الملف الشخصي</h1>
        <p className="text-slate-500">
          قم بتحديث معلوماتك الشخصية وإعدادات الأمان الخاصة بك.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Avatar Setup side */}
        <div className="md:col-span-1">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 text-center shadow-lg">
            <div className="w-32 h-32 rounded-full border-4 border-background mx-auto mb-4 relative group cursor-pointer overflow-hidden shadow-2xl shadow-cyan-500/10">
              <img
                src="https://i.pravatar.cc/150?u=ahmed"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt="Avatar"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-8 h-8 text-slate-800" />
              </div>
            </div>
            <h3 className="text-slate-800 font-bold text-lg">{user.name}</h3>
            <p className="text-slate-500 text-sm mb-6">الحساب مُوثق ✅</p>
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm transition-colors border border-slate-200">
              أزل الصورة
            </button>
          </div>
        </div>

        {/* Forms side */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              المعلومات الشخصية
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs mb-2">
                  البريد الإلكتروني (مُقفل)
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-slate-50/50 border border-transparent rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs mb-2">
                  بلد الإقامة
                </label>
                <select
                  value={user.country}
                  onChange={(e) =>
                    setUser({ ...user, country: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
                >
                  <option>الجزائر</option>
                  <option>المغرب</option>
                  <option>تونس</option>
                  <option>فرنسا</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 bg-cyan-500 text-background px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform">
                <Save className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl p-8 shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              الأمان وتغيير كلمة المرور
            </h3>
            <div className="grid gap-4 mb-6">
              <input
                type="password"
                placeholder="كلمة المرور الحالية"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
              />
              <input
                type="password"
                placeholder="كلمة المرور الجديدة"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
              />
              <input
                type="password"
                placeholder="تأكيد كلمة المرور الجديدة"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">
                تحديث الأمان
              </button>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-full shrink-0 text-red-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-1">
                  منطقة الخطر: حذف الحساب
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  يؤدي هذا إلى حذف بياناتك نهائياً وحذف رصيد المحفظة وإيقاف
                  شرائح eSIM النشطة. هذا الإجراء دائم الفعالية ولا رجعة فيه.
                </p>
                <button className="bg-red-500 text-slate-800 px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-red-600 transition-colors border border-red-600">
                  نعم، حذف الحساب نهائياً
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
