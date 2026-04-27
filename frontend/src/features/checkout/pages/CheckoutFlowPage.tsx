import { useState, useEffect } from 'react';

import { useCartStore } from '../../marketplace/store/cartStore';
import { api } from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import CartReviewStep from '../components/CartReviewStep';
import PaymentStep from '../components/PaymentStep';
import ConfirmationStep from '../components/ConfirmationStep';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock'
);

export default function CheckoutFlowPage() {
  const cart = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cib' | 'edahabia' | 'wallet'>('stripe');
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Exchange rate logic (mocked API call for now, can be plugged into openexchangerates)
  useEffect(() => {
    // In a real app, fetch exchange rate here if needed.
    // We already store dual prices in cart, so we'll just display them.
  }, []);

  const handleCreateIntent = async () => {
    if (cart.items.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await api.post('/checkout/create-intent', {
        items: cart.items,
        promoCode: cart.promoCode,
        currency: 'DZD'
      });
      setClientSecret(res.data.clientSecret);
      setOrderId(res.data.orderId);
      setStep(2);
    } catch (error: any) {
      alert('خطأ في إعداد الدفع: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOrder = async (methodOverride?: string) => {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      await api.post('/checkout/confirm', {
        orderId,
        paymentMethod: methodOverride || paymentMethod
      });
      cart.clearCart();
      setStep(3);
    } catch (error: any) {
      alert('خطأ في تأكيد الطلب: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" dir="rtl">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-6">
        
        {/* Stepper Header */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center space-x-4 space-x-reverse">
            <StepIndicator current={step} target={1} label="مراجعة السلة" />
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-slate-200'}`} />
            <StepIndicator current={step} target={2} label="الدفع" />
            <div className={`w-16 h-1 rounded-full ${step >= 3 ? 'bg-cyan-500' : 'bg-slate-200'}`} />
            <StepIndicator current={step} target={3} label="تأكيد" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
              <CartReviewStep 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onNext={handleCreateIntent}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}

          {step === 2 && orderId && (
            <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
              {paymentMethod === 'stripe' && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                  <PaymentStep 
                    method={paymentMethod}
                    onSuccess={() => handleConfirmOrder('stripe')}
                    onBack={() => setStep(1)}
                  />
                </Elements>
              ) : (
                <PaymentStep 
                  method={paymentMethod}
                  onSuccess={() => handleConfirmOrder(paymentMethod)}
                  onBack={() => setStep(1)}
                />
              )}
            </motion.div>
          )}

          {step === 3 && orderId && (
            <motion.div key="step3" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
              <ConfirmationStep orderId={orderId} />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
}

function StepIndicator({ current, target, label }: { current: number, target: number, label: string }) {
  const active = current >= target;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${active ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
        {target}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}
