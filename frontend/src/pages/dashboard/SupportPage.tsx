import { MessageSquare, Paperclip, Send } from 'lucide-react';

export default function SupportPage() {
  const openTickets = [
    {
      id: 'TKT-0012',
      subject: 'eSIM لا تتصل بالشبكة',
      date: 'اليوم',
      status: 'PENDING',
    },
    {
      id: 'TKT-0008',
      subject: 'استفسار حول الصلاحية',
      date: 'منذ 4 أيام',
      status: 'RESOLVED',
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الدعم الفني</h1>
        <p className="text-gray-400">
          نحن هنا لمساعدتك. افتح تذكرة جديدة أو تابع تذاكرك السابقة.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* New Ticket Form (Cols 2) */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-6">
              فتح تذكرة جديدة
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    نوع المشكلة
                  </label>
                  <select className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500">
                    <option>مشكلة في تفعيل الشريحة</option>
                    <option>استفسار عن الفوترة</option>
                    <option>مشكلة في السرعة / الاتصال</option>
                    <option>أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    رقم الطلب (إن وجد)
                  </label>
                  <input
                    type="text"
                    placeholder="ORD-XXXX..."
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  عنوان الرسالة
                </label>
                <input
                  type="text"
                  placeholder="اكتب عنواناً يصف المشكلة باختصار..."
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  تفاصيل المشكلة
                </label>
                <textarea
                  rows={5}
                  placeholder="اشرح لنا المشكلة بالتفصيل، سنكون سعداء بالرد عبر البريد الإلكتروني..."
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 border-dashed">
                <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-medium transition-colors text-sm px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                  <Paperclip className="w-4 h-4" /> إرفاق صورة (صيغة PNG، JPG)
                </button>
                <button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                  إرسال <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Tickets List */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-white/5 rounded-3xl p-6 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-6">
              تذاكري السابقة
            </h3>

            <div className="space-y-4">
              {openTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-background border border-white/5 rounded-2xl p-4 cursor-pointer hover:border-cyan-500/30 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      {t.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                        t.status === 'PENDING'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {t.status === 'PENDING' ? 'قيد المراجعة' : 'مُغلقة'}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2 group-hover:text-cyan-400 transition-colors">
                    {t.subject}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MessageSquare className="w-3 h-3" /> آخر تحديث: {t.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <MessageSquare className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="text-white font-bold mb-1">المحادثة المباشرة</h4>
              <p className="text-gray-400 text-xs mb-4">
                فريقنا متاح للرد فوراً على أسئلتك المباشرة.
              </p>
              <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                اببدأ المحادثة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
