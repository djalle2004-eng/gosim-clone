import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  // If user is already verified, bypass
  if (user && user.isVerified) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('يرجى إدخال الرمز المكون من 6 أرقام بالكامل.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // We assume the email is in the current user context. If not, the backend
    // requires the email payload. Wait, `verifyEmailSchema` requires OTP and Email.
    // If the Context holds the email state, we use it!
    if (!user || !user.email) {
      setError('انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مجدداً.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('/auth/verify-email', { email: user.email, otp: code });
      await checkAuth(); // Sync strictly Context to verified!
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'رمز خاطئ أو منتهي الصلاحية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative"
      dir="rtl"
    >
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          التحقق من البريد الإلكتروني
        </h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك{' '}
          <strong className="text-white bg-white/5 px-2 py-0.5 rounded">
            {user?.email || '...'}
          </strong>
          .<br /> يرجى إدخاله أدناه.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm justify-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" dir="ltr">
          <div className="flex justify-center gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-background border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 focus:bg-emerald-500/5 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                تأكيد الحساب <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
