import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../features/dashboard/store/notificationStore';
import { api } from '../../lib/api';

const CATEGORY_COLORS: Record<string, string> = {
  ORDER: 'bg-emerald-500/10 text-emerald-400',
  ESIM: 'bg-cyan-500/10 text-cyan-400',
  PAYMENT: 'bg-amber-500/10 text-amber-400',
  SYSTEM: 'bg-slate-500/10 text-slate-400',
  PROMOTION: 'bg-violet-500/10 text-violet-400',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllRead,
  } = useNotificationStore();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data, res.data.meta.unreadCount);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    markAsRead(id);
    await api.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const handleMarkAllRead = async () => {
    markAllRead();
    await api.patch('/notifications/read-all').catch(() => {});
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-cyan-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 bg-[#111120] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) handleMarkAsRead(notif.id);
                      if (notif.url) window.location.href = notif.url;
                      setOpen(false);
                    }}
                    className={`w-full text-left flex gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors border-b border-white/5 last:border-0 ${!notif.isRead ? 'bg-cyan-500/5' : ''}`}
                  >
                    {/* Unread dot */}
                    <div className="mt-1.5 shrink-0">
                      {!notif.isRead ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 block" />
                      ) : (
                        <span className="w-2 h-2 block" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium ${!notif.isRead ? 'text-white' : 'text-slate-300'}`}
                        >
                          {notif.title}
                        </p>
                        {notif.category && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${CATEGORY_COLORS[notif.category] || CATEGORY_COLORS.SYSTEM}`}
                          >
                            {notif.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {notif.body || notif.message}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {notif.url && (
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-1" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
