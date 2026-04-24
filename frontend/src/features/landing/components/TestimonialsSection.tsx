import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمود',
      role: 'رحالة وصانع محتوى',
      image: 'https://i.pravatar.cc/150?u=1',
      content:
        'خدمة خرافية! وصلت باريس وشغلت الـ eSIM قبل ما أنزل من الطيارة. الإنترنت سريع جداً ولا يوجد أي تقطيع.',
      rating: 5,
    },
    {
      id: 2,
      name: 'سارة خالد',
      role: 'رائدة أعمال',
      image: 'https://i.pravatar.cc/150?u=2',
      content:
        'أفضل خيار لرحلات العمل المتكررة. اشتريت باقة أوروبا وارتحت من هم تبديل الشرائح في كل دولة.',
      rating: 5,
    },
    {
      id: 3,
      name: 'عمر عبد الله',
      role: 'طالب مبتعث',
      image: 'https://i.pravatar.cc/150?u=3',
      content:
        'أسعار ممتازة جداً مقارنة بالشركات المحلية. التفعيل أخذ مني دقيقة واحدة فقط. أنصح به بشدة.',
      rating: 4,
    },
    {
      id: 4,
      name: 'ليلى حسن',
      role: 'مصورة فوتوغرافية',
      image: 'https://i.pravatar.cc/150?u=4',
      content:
        'كنت أشارك صوري من تركيا في نفس اللحظة بفضل سرعة 5G. تجربة لا تُنسى وسأعتمد عليهم دائماً.',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 transform -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-lg text-slate-600">
            انضم لأكثر من 10 مليون مسافر يثقون في خدماتنا حول العالم.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto h-[350px] md:h-[250px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                x:
                  index === currentIndex
                    ? 0
                    : index < currentIndex
                      ? -100
                      : 100,
                scale: index === currentIndex ? 1 : 0.9,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`absolute inset-0 w-full flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 border border-slate-100 rounded-3xl shadow-lg ${index !== currentIndex ? 'pointer-events-none' : ''}`}
            >
              <div className="shrink-0 relative">
                <Quote className="absolute -top-3 -right-3 w-8 h-8 text-cyan-400 rotate-180 bg-white rounded-full p-1 shadow-sm" />
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="text-center md:text-right flex-1">
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-slate-700 italic font-medium leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <span className="text-slate-500 text-sm">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-cyan-500'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
