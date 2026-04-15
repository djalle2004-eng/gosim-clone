import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'SUCCESS',
      title: 'دفع ناجح',
      message: 'تم استلام دفعتك بقيمة 2,800 د.ج لباقة فرنسا شكراً لك.',
      time: 'منذ ساعتين',
      isRead: false,
      icon: <CheckCircle2 className="text-emerald-400" />,
    },
    {
      id: 2,
      type: 'ALERT',
      title: 'الباقة أوشكت على الانتهاء',
      message: 'تبقّى لك 500 ميغابايت فقط في باقة تركيا، نوصي بالشحن قريباً.',
      time: 'منذ يومين',
      isRead: false,
      icon: <AlertTriangle className="text-orange-400" />,
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: 'تحديث الأمان',
      message: 'تم تحديث كلمة المرور الخاصة بك بنجاح.',
      time: 'منذ أسبوع',
      isRead: true,
      icon: <ShieldCheck className="text-cyan-400" />,
    },
    {
      id: 4,
      type: 'PROMO',
      title: 'عرض خاص لفصل الصيف! 🔥',
      message:
        'احصل على خصم 20% على باقات أوروبا الشاملة باستخدام الكود SUMMER26.',
      time: 'منذ شهر',
      isRead: true,
      icon: <Flame className="text-red-400" />,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            الإشعارات
            {unreadCount > 0 && (
              <span className="bg-violet-600 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400">
            ابقَ مطلعاً على تفاصيل الباقات والعروض الترويجية وتنبيهات النظام.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-cyan-400 hover:text-cyan-300 font-medium text-sm border border-cyan-500/30 px-4 py-2 rounded-xl transition-colors"
          >
            تعليم الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={notif.id}
            className={`bg-card border p-6 rounded-3xl flex gap-4 transition-all ${
              notif.isRead
                ? 'border-white/5 opacity-70'
                : 'border-white/20 shadow-lg shadow-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-background border border-white/5 flex items-center justify-center shrink-0">
              {notif.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3
                  className={`font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}
                >
                  {notif.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" /> {notif.time}
                </div>
              </div>
              <p
                className={`text-sm leading-relaxed ${notif.isRead ? 'text-gray-500' : 'text-gray-300'}`}
              >
                {notif.message}
              </p>
            </div>
            {!notif.isRead && (
              <div className="shrink-0 self-center">
                <span className="block w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-background border border-white/5 p-6 rounded-3xl">
        <h4 className="text-white font-bold mb-4">إعدادات الإشعارات</h4>
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <div>
            <div className="text-white">إشعارات البريد الإلكتروني</div>
            <div className="text-gray-500 text-xs">
              احصل على رسائل حول الفواتير والانتهاء التدريجي
            </div>
          </div>
          <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer shadow-inner">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        </div>
        <div className="flex justify-between items-center py-3">
          <div>
            <div className="text-white">العروض الترويجية</div>
            <div className="text-gray-500 text-xs">
              احصل على أكواد التخفيضات والعروض الجديدة
            </div>
          </div>
          <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-gray-400 rounded-full absolute left-1 top-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
