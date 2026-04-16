import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  CreditCard,
  Landmark,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StripePaymentForm from '../components/checkout/StripePaymentForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

// Initialize Stripe (requires Vite environment variable mapped in real app)
// For mocking UI quickly without hitting real API, I will implement a safe fallback
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_mock_123'
);

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('planId');
  const quantity = Number(searchParams.get('qty')) || 1;
  const [paymentMethod, setPaymentMethod] = useState<
    'stripe' | 'cib' | 'edahabia'
  >('cib');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Fetch plan info to calculate secure prices (Never trust frontend price states)
  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan-checkout', planId],
    queryFn: async () => {
      if (!planId) throw new Error('No plan provided');
      const res = await api.get(`/plans/${planId}?currency=DZD`);
      return res.data;
    },
    enabled: !!planId,
  });

  const totalDzd = plan ? plan.price * quantity : 0;
  const totalUsd = plan ? plan.priceUsd * quantity : 0;

  useEffect(() => {
    // Standard approach to fetch mock client secret if Stripe tab is open
    if (paymentMethod === 'stripe' && totalDzd > 0) {
      // Fast mockup interval since we don't configure real Intent on backend yet without Keys
      setClientSecret('pi_mock_1234_secret_5678');
    }
  }, [paymentMethod, totalDzd]);

  if (!planId)
    return (
      <div className="text-white min-h-screen text-center pt-32">
        يرجى اختيار باقة أولاً
      </div>
    );
  if (isLoading)
    return (
      <div className="text-center w-full min-h-screen pt-32">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );

  const handlePayment = async () => {
    if (!plan || isProcessing) return;

    try {
      setIsProcessing(true);

      // 1. Create the Order in the backend
      const orderRes = await api.post('/orders', {
        planId: plan.id,
        quantity,
        currency: plan.currency || 'USD',
        price: plan.price,
      });

      const orderId = orderRes.data.id;

      // 2. Simulate Payment Success (Dev Mode)
      // In production, this would happen via Stripe/CIB redirect or Webhook
      await api.post('/payments/simulate-success', { orderId });

      // 3. Navigate to success
      navigate('/checkout/success?mock=true');
    } catch (error: any) {
      console.error('Payment simulation failed:', error);
      alert('خطأ في معالجة الدفع: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const mockCibCheckout = () => {
    handlePayment();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Checkout Forms */}
          <div className="lg:w-3/5 w-full space-y-8">
            {/* Customer Info Form */}
            <div className="bg-card border border-white/5 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  1
                </span>
                المعلومات الشخصية
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    البريد الإلكتروني للإيصال والـ QR
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-white outline-none"
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-white outline-none"
                    placeholder="+213 550..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card border border-white/5 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  2
                </span>
                طريقة الدفع
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    id: 'cib',
                    label: 'CIB',
                    icon: <Landmark />,
                    color: 'bg-green-500/10 text-green-500 border-green-500/20',
                  },
                  {
                    id: 'edahabia',
                    label: 'الذهبية',
                    icon: <Phone />,
                    color:
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                  },
                  {
                    id: 'stripe',
                    label: 'بطاقة دولية',
                    icon: <CreditCard />,
                    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-cyan-500 bg-cyan-500/10 scale-105' : 'border-white/5 bg-background hover:bg-white/5'}`}
                  >
                    <div className={method.color + ' p-2 rounded-full'}>
                      {method.icon}
                    </div>
                    <span className="text-white font-medium text-sm md:text-base">
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Engine Switcher */}
              <div className="bg-background border border-white/5 p-6 md:p-8 rounded-2xl relative overflow-hidden text-center text-white">
                <AnimatePresence mode="wait">
                  {paymentMethod === 'stripe' && clientSecret && (
                    <motion.div
                      key="stripe"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-gray-400 mb-6 text-sm">
                        يقوم Stripe بمعالجة المدفوعات الدولية بأسلوب آمن ومعتمد
                        مشفّر.
                      </p>
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: { theme: 'night' },
                        }}
                      >
                        <StripePaymentForm amount={totalDzd} />
                      </Elements>
                    </motion.div>
                  )}

                  {(paymentMethod === 'cib' ||
                    paymentMethod === 'edahabia') && (
                    <motion.div
                      key="local"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8"
                    >
                      <Landmark className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                      <h3 className="text-xl font-bold mb-2">
                        الدفع المباشر عبر{' '}
                        {paymentMethod === 'cib' ? 'CIB' : 'البطاقة الذهبية'}
                      </h3>
                      <p className="text-gray-400 text-sm mb-8 mx-auto max-w-sm">
                        سيتم تحويلك إلى نافذة الدفع الرسمية الآمنة لـ Satim
                        (البنك الوطني) لإكمال المعاملة.
                      </p>
                      <button
                        onClick={mockCibCheckout}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'جاري المعالجة...' : 'الدفع الآن وتفعيل الشريحة'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs text-center border-t border-white/5 pt-6">
                <ShieldCheck className="w-4 h-4" /> ضمان حماية البيانات 100%،
                نحن لا نخزن تفاصيل بطاقتك أبداً.
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-2/5 w-full">
            <div className="bg-card border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
              <h3 className="text-white font-bold text-lg border-b border-white/10 pb-4 mb-6">
                ملخص الطلب
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{plan.country?.flag}</span>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{plan.name}</h4>
                  <p className="text-gray-400 text-sm tracking-wide">
                    بيانات:{' '}
                    {plan.isUnlimited ? 'غير محدود' : `${plan.dataAmount} GB`}
                  </p>
                </div>
                <div className="text-white font-bold text-xl">
                  {plan.price} د.ج
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center mb-6">
                <span className="text-gray-400 text-sm">الكمية</span>
                <span className="text-white font-bold bg-background px-4 py-1.5 rounded-lg border border-white/5">
                  {quantity}
                </span>
              </div>

              <div className="space-y-3 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between items-center text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{(plan.price * quantity).toLocaleString()} د.ج</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>رسوم التفعيل</span>
                  <span className="text-emerald-400">مجانًا</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-2">
                <span className="text-white font-bold text-lg">الإجمالي</span>
                <div className="text-right">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 leading-none">
                    {totalDzd.toLocaleString()} د.ج
                  </div>
                  <div className="text-gray-500 font-medium text-sm mt-1">
                    ما يعادل ${totalUsd.toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
