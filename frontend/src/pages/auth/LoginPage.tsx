import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await login({ emailOrPhone, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في تسجيل الدخول. تأكد من صحة بياناتك.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Link to="/" className="absolute top-8 right-8 text-white font-black text-2xl flex items-center gap-2 z-10 transition-transform hover:scale-105">
        <div className="w-8 h-8 rounded-lg bg-cyan-500 text-background flex items-center justify-center text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">G</div>
        Go<span className="text-cyan-400">SIM</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك! 👋</h1>
          <p className="text-gray-400">سجل الدخول لإدارة باقات eSIM الخاصة بك</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 flex-row-reverse text-sm" dir="ltr">
            <span className="flex-1 text-right">{error}</span>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col text-right">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني أو رقم الهاتف</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 pl-12 text-white outline-none focus:border-cyan-500 transition-colors text-right"
                placeholder="مثال: user@mail.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">كلمة المرور</label>
              <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">هل نسيت كلمة المرور؟</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 pl-12 text-white outline-none focus:border-cyan-500 transition-colors text-right"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <input 
               type="checkbox" 
               id="remember" 
               checked={rememberMe}
               onChange={e => setRememberMe(e.target.checked)}
               className="w-4 h-4 rounded border-gray-600 outline-none"
             />
             <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">تذكرني على هذا الجهاز (90 يوماً)</label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>تسجيل الدخول <ArrowRight className="w-5 h-5" /></>
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          ليس لديك حساب؟ <Link to="/register" className="text-cyan-400 font-bold hover:underline">سجل مجاناً الآن</Link>
        </div>
      </motion.div>
    </div>
  );
}
