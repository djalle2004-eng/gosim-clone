import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(formData);
      navigate('/verify'); // Redirect strictly to OTP screen
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Zod Array Errors Parser
        const msgs = err.response.data.errors
          .map((e: any) => e.message)
          .join('، ');
        setError(msgs);
      } else {
        setError(err.response?.data?.message || 'فشل في إنشاء الحساب.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-400">
            انضم إلى SoufSim لاكتشاف أفضل باقات التجوال.
          </p>
        </div>

        {error && (
          <div
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 flex-row-reverse text-sm"
            dir="ltr"
          >
            <span className="flex-1 text-right">{error}</span>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الاسم الأول
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الاسم العائلي
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                placeholder="+213..."
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              كلمة المرور (8 أحرف، رموز وحروف)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                تسجيل حساب <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          لديك حساب مسبقاً؟{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
