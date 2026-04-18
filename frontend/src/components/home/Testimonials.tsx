import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const reviews = [
    {
      name: 'أحمد بن علي',
      avatar: 'https://i.pravatar.cc/150?u=ahmed',
      country: '🇩🇿 الجزائر',
      rating: 5,
      text: 'استخدمت الخدمة في رحلتي إلى إسبانيا، التفعيل كان فورياً والإنترنت سريع جداً. شكراً SoufSim!',
    },
    {
      name: 'سارة محمد',
      avatar: 'https://i.pravatar.cc/150?u=sara',
      country: '🇲🇦 المغرب',
      rating: 5,
      text: 'أفضل تجربة eSIM جربتها! الأسعار تنافسية ولا وجود لرسوم التجوال المخفية على الإطلاق.',
    },
    {
      name: 'يوسف القحطاني',
      avatar: 'https://i.pravatar.cc/150?u=yousef',
      country: '🇸🇦 السعودية',
      rating: 4,
      text: 'منصة ممتازة وسهلة الاستخدام. اشتريت باقة أوروبا والدعم الفني كان متعاوناً جداً.',
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[50%] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            ماذا يقول <span className="text-cyan-400">عملاؤنا</span>
          </h2>
          <p className="text-slate-500 text-lg">
            آلاف المسافرين يثقون في SoufSim ليبقوا متصلين في رحلاتهم.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              key={idx}
              className="bg-white/90 backdrop-blur-md border border-slate-200 p-8 rounded-3xl relative"
            >
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`}
                  />
                ))}
              </div>

              <p className="text-slate-600 font-medium leading-relaxed mb-8">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/30"
                />
                <div>
                  <h4 className="text-slate-800 font-bold">{review.name}</h4>
                  <span className="text-slate-500 text-sm">
                    {review.country}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
