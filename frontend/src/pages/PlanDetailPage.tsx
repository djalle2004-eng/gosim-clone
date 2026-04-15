import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Star,
  ChevronRight,
  Zap,
  Globe,
  Smartphone,
  ShieldCheck,
  Check,
  Minus,
  Plus,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PlanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'specs' | 'activation' | 'reviews'
  >('specs');
  const [quantity, setQuantity] = useState(1);

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', slug],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/api/plans/${slug}?currency=DZD`
      );
      if (!res.ok) throw new Error('Plan not found');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!plan)
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        لم يتم العثور على الباقة
      </div>
    );

  const handleCheckout = () => {
    navigate(`/checkout?planId=${plan.id}&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <span className="hover:text-white cursor-pointer">الرئيسية</span>{' '}
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-white cursor-pointer">الباقات</span>{' '}
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-white cursor-pointer">
            {plan.country?.nameEn}
          </span>{' '}
          <ChevronRight className="w-4 h-4" />
          <span className="text-cyan-400 font-bold">{plan.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
          {/* Left Column: Details */}
          <div className="lg:w-2/3 w-full">
            {/* Header */}
            <div className="bg-card border border-white/5 rounded-3xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-right">
                <span className="text-8xl drop-shadow-2xl">
                  {plan.country?.flag}
                </span>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                      {plan.country?.region}
                    </span>
                    {plan.speed === '5G' && (
                      <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs px-3 py-1 rounded-full font-bold">
                        5G فائق السرعة
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {plan.name}
                  </h1>
                  <p className="text-xl text-gray-400 mb-4">
                    {plan.country?.nameAr || plan.country?.nameEn} - سعة{' '}
                    {plan.isUnlimited ? 'غير محدودة' : `${plan.dataAmount} GB`}
                  </p>

                  <div
                    className="flex items-center justify-center md:justify-start gap-2 text-amber-400 cursor-pointer hover:underline"
                    onClick={() => setActiveTab('reviews')}
                  >
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold text-white ml-2 text-lg">
                      4.9
                    </span>
                    <span className="text-gray-500 text-sm">(124 تقييم)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Trigger */}
            <div className="flex overflow-x-auto no-scrollbar gap-4 mb-6 border-b border-white/10 pb-4">
              {[
                { id: 'specs', label: 'المواصفات' },
                { id: 'activation', label: 'كيفية التفعيل' },
                { id: 'reviews', label: 'التقييمات' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 text-background' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'specs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Globe className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-gray-400 text-sm">التغطية</span>
                    <span className="text-white font-bold">
                      {plan.country?.nameEn}
                    </span>
                  </div>
                  <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Zap className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-gray-400 text-sm">سرعة الشبكة</span>
                    <span className="text-white font-bold">{plan.speed}</span>
                  </div>
                  <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Smartphone className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-gray-400 text-sm">إمكانية الشحن</span>
                    <span className="text-white font-bold">مدعوم</span>
                  </div>
                  <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-6 h-6 text-cyan-400 mb-2" />
                    <span className="text-gray-400 text-sm">المكالمات</span>
                    <span className="text-white font-bold">بيانات فقط</span>
                  </div>
                </div>

                <div className="bg-card border border-white/5 p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-4">
                    وصف الباقة
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    توفر هذه الباقة اتصالاً مباشراً وآمناً على أفضل الشبكات
                    المحلية في {plan.country?.nameEn}. مثالية للسياحة، العمل، أو
                    البقاء على اتصال دائم بالعائلة. لا توجد أي رسوم خفية أو عقود
                    إضافية.
                  </p>

                  <h4 className="font-bold text-white mb-3">
                    الأجهزة المتوافقة:
                  </h4>
                  <p className="text-gray-400 text-sm">
                    تعمل شريحة eSIM حصرياً على الهواتف والأجهزة التي تدعم هذه
                    التقنية وغير المقفلة لشبكة معينة (مثل iPhone 11 فما فوق،
                    Samsung Galaxy S20 فما فوق، وخطوط Google Pixel).
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'activation' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-white/5 p-6 md:p-10 rounded-3xl"
              >
                <h3 className="text-xl font-bold text-white mb-8">
                  عملية تثبيت سريعة
                </h3>

                <div className="space-y-8 relative">
                  <div className="absolute top-0 bottom-0 right-[25px] w-0.5 bg-white/10 hidden md:block z-0"></div>

                  {[
                    {
                      title: 'اشترِ الباقة',
                      desc: 'أكمل عملية الدفع الآمنة للحصول على شريحتك الإلكترونية فوراً.',
                    },
                    {
                      title: 'امسح الرمز (QR Code)',
                      desc: 'سوف يصلك رمز الاستجابة السريعة (QR) على بريدك الإلكتروني وفي لوحة التحكم الخاصة بك.',
                    },
                    {
                      title: 'الاستمتاع بالإنترنت',
                      desc: 'سيتم تفعيل الباقة تلقائياً بمجرد اتصال هاتفك بشبكة الدولة الوجهة.',
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-6 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-cyan-500/20">
                        {idx + 1}
                      </div>
                      <div className="pt-2">
                        <h4 className="text-lg font-bold text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between filter grayscale blur-[2px] opacity-60">
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center text-black font-bold">
                    QR CODE
                  </div>
                  <p className="text-center md:text-right">
                    سيظهر الرمز الخاص بك هنا فور اكتمال الدفع بنجاح.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-card rounded-3xl border border-white/5"
              >
                <Star className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  تقييمات العملاء
                </h3>
                <p className="text-gray-400">
                  ستتوفر مراجعات هذه الباقة قريباً من قبل مستخدمينا.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Sticky Pricing Card */}
          <div className="lg:w-1/3 w-full lg:sticky lg:top-24">
            <div className="bg-card border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              {/* Animated glow */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

              <div className="mb-8 border-b border-white/10 pb-8 text-center text-white">
                <span className="block text-gray-500 text-sm font-medium mb-3">
                  السعر الإجمالي
                </span>
                <div className="text-5xl font-black tracking-tight flex items-center justify-center gap-2 mb-2">
                  <span className="text-cyan-400 text-2xl">د.ج</span>
                  {(plan.price * quantity).toLocaleString()}
                </div>
                <div className="text-gray-400 font-medium">
                  ${(plan.priceUsd * quantity).toFixed(2)} USD
                </div>
              </div>

              <div className="mb-6 bg-background rounded-2xl border border-white/5 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">الصلاحية:</span>
                  <span className="font-bold text-white">
                    {plan.validity} أيام
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">حجم البيانات:</span>
                  <span className="font-bold text-white">
                    {plan.isUnlimited ? 'غير محدود' : `${plan.dataAmount} GB`}
                  </span>
                </div>
                {plan.retailPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">سعر التوفير:</span>
                    <span className="font-bold text-emerald-400 line-through">
                      د.ج {(plan.retailPrice * quantity).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-8 bg-background border border-white/5 p-2 rounded-2xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-xl font-bold flex-1 text-center text-white">
                  {quantity}
                  <span className="text-sm text-gray-500 font-normal mr-2">
                    شرائح
                  </span>
                </div>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full relative overflow-hidden group/btn bg-white/5 text-white py-5 rounded-2xl font-bold text-lg transition-all border border-white/10 hover:border-transparent mb-4 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/30"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-90 group-hover/btn:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  اشتري الآن <Check className="w-5 h-5" />
                </span>
              </button>

              <button className="w-full py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                إضافة للسلة للتسوق لاحقاً
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
