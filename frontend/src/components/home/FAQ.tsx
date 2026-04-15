import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "ما هي شريحة eSIM؟",
      a: "شريحة eSIM هي شريحة رقمية مدمجة في هاتفك مسبقاً تسمح لك بتفعيل باقة إنترنت دولية دون الحاجة لاستخدام شريحة بلاستيكية فعلية."
    },
    {
      q: "هل يعمل هاتفي مع خدمة eSIM من GoSIM؟",
      a: "معظم الهواتف الحديثة من عام 2019 فصاعداً (مثل iPhone 11+ و Samsung S20+) تدعم هذه الميزة. يمكنك التأكد بسهولة من إعدادات الشبكة."
    },
    {
      q: "متى يبدأ حساب باقة الإنترنت الخاصة بي؟",
      a: "تبدأ صلاحية الباقة فور مسحك للـ QR كود وتفعيلها على شبكة الدولة الوجهة، وليس من وقت الشراء."
    },
    {
      q: "عن طريق ماذا يمكنني الدفع في الجزائر؟",
      a: "نوفر طرق دفع عالمية بالمحفظات (PayPal، Stripe) بالإضافة لطرق محلية مثل البطاقة الذهبية أو CIB لسهولة التعامل."
    },
    {
      q: "هل يمكنني إجراء مكالمات باستخدام الـ eSIM؟",
      a: "باقتنا مخصصة للبيانات (الإنترنت) فقط. لكن يمكنك استخدام تطبيقات مثل WhatsApp للاتصال المرئي والصوتي مجاناً."
    },
    {
      q: "ماذا أفعل إذا نفدت البيانات؟",
      a: "ببساطة قم بتسجيل الدخول إلى حسابك واشحن رصيدك بباقة جديدة للوجهة نفسها فورا وسيتم تجديدها تلقائياً."
    }
  ];

  return (
    <section className="py-24 bg-card" id="faq">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">الأسئلة <span className="text-cyan-400">الشائعة</span></h2>
          <p className="text-gray-400 text-lg">إليك إجابات لأبرز الاستفسارات التي تهم المسافرين.</p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-background border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === idx ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'border-white/5 hover:border-white/10'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-right"
              >
                <span className="font-bold text-white text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
