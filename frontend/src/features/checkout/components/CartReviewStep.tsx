import { useState } from 'react';
import { useCartStore } from '../../marketplace/store/cartStore';
import { Trash2, Tag, CreditCard, Landmark, Wallet, Phone } from 'lucide-react';
import CountryFlag from '../../../components/ui/CountryFlag';

interface CartReviewStepProps {
  paymentMethod: 'stripe' | 'cib' | 'edahabia' | 'wallet';
  setPaymentMethod: (m: 'stripe' | 'cib' | 'edahabia' | 'wallet') => void;
  onNext: () => void;
  isProcessing: boolean;
}

export default function CartReviewStep({
  paymentMethod,
  setPaymentMethod,
  onNext,
  isProcessing,
}: CartReviewStepProps) {
  const cart = useCartStore();
  const [promoInput, setPromoInput] = useState(cart.promoCode || '');

  const handleApplyPromo = () => {
    // Mock validation
    if (promoInput.toUpperCase() === 'SOUFSIM10') {
      cart.applyPromo('SOUFSIM10', 0.1);
      setPromoInput('');
    } else {
      alert('كود خصم غير صحيح');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">السلة فارغة</h2>
        <p className="text-slate-500 mb-8">
          لم تقم بإضافة أي باقات إلى سلتك بعد.
        </p>
        <button
          onClick={() => (window.location.href = '/plans')}
          className="bg-cyan-500 text-slate-900 px-8 py-3 rounded-xl font-bold"
        >
          تصفح الباقات
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="lg:w-2/3 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
            مراجعة السلة
          </h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <CountryFlag code={item.countryCode || ''} size="lg" />
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">
                      {item.isUnlimited
                        ? 'بيانات غير محدودة'
                        : `${item.dataAmount} GB`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() =>
                        cart.updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                    >
                      -
                    </button>
                    <span className="font-medium text-slate-800 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        cart.updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right w-24">
                    <div className="font-bold text-slate-800">
                      {item.priceDzd * item.quantity} د.ج
                    </div>
                  </div>
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="text-red-400 hover:text-red-500 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4">
          <Tag className="text-cyan-500 w-6 h-6" />
          <input
            type="text"
            placeholder="أدخل كود الخصم (جرب SOUFSIM10)"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleApplyPromo}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700"
          >
            تطبيق
          </button>
        </div>

        {/* Payment Methods Selection */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
            اختر طريقة الدفع
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: 'cib',
                label: 'CIB',
                icon: <Landmark />,
                color: 'text-green-600',
                bg: 'bg-green-50 border-green-200',
              },
              {
                id: 'edahabia',
                label: 'الذهبية',
                icon: <Phone />,
                color: 'text-yellow-600',
                bg: 'bg-yellow-50 border-yellow-200',
              },
              {
                id: 'stripe',
                label: 'Stripe',
                icon: <CreditCard />,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50 border-indigo-200',
              },
              {
                id: 'wallet',
                label: 'المحفظة',
                icon: <Wallet />,
                color: 'text-cyan-600',
                bg: 'bg-cyan-50 border-cyan-200',
              },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === method.id ? `border-cyan-500 ${method.bg} scale-[1.02]` : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
              >
                <div className={`${method.color} mb-1`}>{method.icon}</div>
                <span className="font-bold text-slate-800 text-sm">
                  {method.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-32">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
            ملخص الطلب
          </h2>

          <div className="space-y-4 mb-6 text-slate-600">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span className="font-medium text-slate-800">
                {cart.getTotalDzd().toLocaleString()} د.ج
              </span>
            </div>
            {cart.discountRate > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>الخصم ({cart.discountRate * 100}%)</span>
                <span>- {cart.getDiscountDzd().toLocaleString()} د.ج</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>رسوم التفعيل والضريبة</span>
              <span className="text-emerald-500">مجانًا</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-lg font-bold text-slate-800">الإجمالي</span>
              <span className="text-3xl font-black text-cyan-500">
                {cart.getFinalTotalDzd().toLocaleString()} د.ج
              </span>
            </div>
            <p className="text-sm text-slate-400 text-right">
              ~ ${cart.getTotalUsd().toFixed(2)} USD
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
          >
            {isProcessing ? 'جاري التحضير...' : 'متابعة للدفع'}
          </button>
        </div>
      </div>
    </div>
  );
}
