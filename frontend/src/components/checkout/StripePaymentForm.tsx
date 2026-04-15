import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
}

export default function StripePaymentForm({ amount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded.
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Call checkout endpoint
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect completely back to success page
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      // Show error to your customer (e.g., payment details incomplete)
      setErrorMessage(error.message || 'حدث خطأ غير متوقع أثناء معالجة الدفع.');
    } else {
      // The payment has been processed!
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-inner mb-6">
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
          }} 
        />
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        disabled={!stripe || isProcessing}
        className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg hover:shadow-cyan-500/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> جاري الدفع...</span>
        ) : (
          <span>دفع {amount.toFixed(2)} DZD</span>
        )}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-2">
        <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> معالجة آمنة مشفرة 256-bit
      </p>
    </form>
  );
}
