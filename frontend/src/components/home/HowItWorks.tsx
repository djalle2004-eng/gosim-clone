import { Search, CreditCard, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-slate-800" />,
      title: 'اختر باقتك',
      description:
        'ابحث عن وجهتك واختر بيانات الإنترنت التي تناسب رحلتك من بين أكثر من 170 دولة متوفرة.',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-slate-800" />,
      title: 'ادفع بأمان',
      description:
        'ادفع بطريقتك المريحة عبر البطاقات العالمية أو المحلية (CIB / ذهبية) بسرعة وأمان تام.',
      color: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: <ScanLine className="w-8 h-8 text-slate-800" />,
      title: 'فعّل الـ eSIM',
      description:
        'امسح رمز الاستجابة السريعة (QR) الذي يصلك فوراً وابدأ في تصفح الإنترنت حال وصولك.',
      color: 'from-emerald-400 to-cyan-500',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 relative bg-white/90 backdrop-blur-md border-y border-border"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            كيف يعمل SoufSim؟
          </h2>
          <p className="text-slate-500 text-lg">
            ثلاث خطوات بسيطة فقط تفصلك عن إنترنت سريع ومستقر حول العالم.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              key={index}
              className="relative z-10 flex flex-col items-center text-center p-6"
            >
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-1 mb-6 shadow-xl`}
              >
                <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center relative overflow-hidden group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-40 transition-opacity`}
                  ></div>
                  {step.icon}
                  {/* Number Badge */}
                  <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
