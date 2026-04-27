import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { ShieldCheck, Landmark, Phone, Wallet } from 'lucide-react';
import { useCartStore } from '../../marketplace/store/cartStore';

interface PaymentStepProps {
  method: 'stripe' | 'cib' | 'edahabia' | 'wallet';
  onSuccess: () => void;
  onBack: () => void;
}

export default function PaymentStep({ method, onSuccess, onBack }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // We use confirmPayment to automatically handle 3D secure and redirects
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Prevent immediate redirect if we can handle it here
    });

    if (stripeError) {
      setError(stripeError.message || 'حدث خطأ غير متوقع');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      // e.g. requires_action -> Stripe automatically redirects if redirect: 'always'
      // but with 'if_required' it might return early. Usually, handled implicitly.
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    if (method === 'stripe') {
      return (
        <form onSubmit={handleSubmitStripe} className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <PaymentElement options={{ layout: 'tabs' }} />
          </div>
          {error && <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-xl">{error}</div>}
          <button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isProcessing ? 'جاري المعالجة والمصادقة 3D...' : `دفع ${cart.getFinalTotalDzd().toLocaleString()} د.ج`}
          </button>
        </form>
      );
    }

    if (method === 'cib' || method === 'edahabia') {
      return (
        <div className="text-center py-8">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${method === 'cib' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {method === 'cib' ? <Landmark className="w-10 h-10" /> : <Phone className="w-10 h-10" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">بوابة الدفع الوطنية Satim</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            سيتم تحويلك الآن إلى النافذة الرسمية الآمنة لإدخال بيانات {method === 'cib' ? 'بطاقة CIB' : 'البطاقة الذهبية'} الخاصة بك. سيتم إرجاعك تلقائياً هنا بعد نجاح العملية.
          </p>
          <div className="bg-slate-100 p-4 rounded-xl mb-8 flex items-center justify-between">
            <span className="text-slate-500">رقم المرجع (Order Ref):</span>
            <span className="font-mono font-bold text-slate-800">CIB-{Math.floor(Math.random()*1000000)}</span>
          </div>
          <button 
            onClick={() => {
              setIsProcessing(true);
              // MOCKING the CIB redirect flow
              setTimeout(() => { onSuccess(); }, 2000);
            }}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
             {isProcessing ? 'جاري التحويل للبنك...' : 'متابعة إلى بوابة الدفع'}
          </button>
        </div>
      );
    }

    if (method === 'wallet') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">الدفع من المحفظة</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">سيتم الخصم المباشر من رصيد محفظتك المتاح.</p>
          <button 
            onClick={() => {
              setIsProcessing(true);
              setTimeout(() => { onSuccess(); }, 1500);
            }}
            disabled={isProcessing}
            className="w-full bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
             {isProcessing ? 'جاري الخصم...' : 'تأكيد الدفع'}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
        {renderContent()}
        
        <div className="mt-8 flex items-center justify-between">
          <button onClick={onBack} disabled={isProcessing} className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            &rarr; الرجوع للسلة
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4" /> دفع آمن ومشفر 100%
          </div>
        </div>
      </div>
    </div>
  );
}
