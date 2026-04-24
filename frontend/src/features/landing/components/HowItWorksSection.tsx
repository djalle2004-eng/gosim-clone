import { motion } from 'framer-motion';
import { Search, CreditCard, QrCode } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: 'اختر خطتك',
      description:
        'ابحث عن وجهتك واختر خطة البيانات التي تناسب احتياجاتك ومدة رحلتك.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: CreditCard,
      title: 'ادفع بأمان',
      description:
        'أكمل عملية الدفع بأمان باستخدام وسائل الدفع الموثوقة أو البطاقة الذهبية.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: QrCode,
      title: 'فعّل فوراً',
      description:
        'امسح رمز الـ QR الذي سيصلك عبر البريد الإلكتروني وابدأ التصفح فوراً.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            كيف تعمل الخدمة؟
          </h2>
          <p className="text-lg text-slate-600">
            احصل على اتصال إنترنت في أي مكان في العالم خلال 3 خطوات بسيطة فقط،
            بدون الحاجة لزيارة أي متجر.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center bg-white p-6 rounded-2xl"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${step.color} mb-6 shadow-sm border border-white ring-8 ring-white`}
              >
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {index + 1}. {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
