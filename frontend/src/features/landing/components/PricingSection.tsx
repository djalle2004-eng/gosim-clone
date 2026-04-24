import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'مثالي للمسافرين العرضيين',
      features: [
        { name: 'وصول إلى 190+ دولة', included: true },
        { name: 'تطبيق لإدارة الخطط', included: true },
        { name: 'دعم عبر البريد الإلكتروني', included: true },
        { name: 'خصومات الشركات', included: false },
        { name: 'مدير حساب شخصي', included: false },
        { name: 'واجهة برمجة التطبيقات (API)', included: false },
      ],
      button: 'انضم مجاناً',
      isPopular: false,
    },
    {
      name: 'Pro',
      price: '29',
      period: '/شهر',
      description: 'للشركات الصغيرة والمتوسطة',
      features: [
        { name: 'وصول إلى 190+ دولة', included: true },
        { name: 'تطبيق لإدارة الخطط', included: true },
        { name: 'دعم أولوية 24/7', included: true },
        { name: 'خصومات الشركات تصل لـ 15%', included: true },
        { name: 'لوحة تحكم للموظفين', included: true },
        { name: 'واجهة برمجة التطبيقات (API)', included: false },
      ],
      button: 'ابدأ النسخة التجريبية',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'مخصص',
      description: 'للشركات الكبرى والمنظمات',
      features: [
        { name: 'وصول إلى 190+ دولة', included: true },
        { name: 'تطبيق بإسم شركتك (White-label)', included: true },
        { name: 'دعم مخصص 24/7', included: true },
        { name: 'خصومات غير محدودة', included: true },
        { name: 'مدير حساب شخصي', included: true },
        { name: 'واجهة برمجة التطبيقات (API) كاملة', included: true },
      ],
      button: 'تواصل مع المبيعات',
      isPopular: false,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            خطط للشركات والأعمال
          </h2>
          <p className="text-lg text-slate-600">
            سواء كنت مسافراً منفرداً أو تدير شركة بآلاف الموظفين، لدينا الخطة المناسبة لضمان اتصالك دائماً.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.isPopular 
                  ? 'border-cyan-400 shadow-2xl shadow-cyan-100 scale-100 md:scale-105 z-10' 
                  : 'border-slate-200 shadow-lg'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  الأكثر شيوعاً للأعمال
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  {plan.price !== 'مخصص' && <span className="text-3xl font-bold text-slate-900">$</span>}
                  <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 mb-2">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-cyan-600" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <X className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-200'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
