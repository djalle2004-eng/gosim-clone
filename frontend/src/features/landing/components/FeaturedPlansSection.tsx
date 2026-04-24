import { motion } from 'framer-motion';
import { Wifi, Clock, Globe2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedPlansSection() {
  const plans = [
    { id: '1', country: 'تركيا', flag: '🇹🇷', data: '10GB', days: 30, price: 15, isBestSeller: true },
    { id: '2', country: 'أوروبا', flag: '🇪🇺', data: '20GB', days: 30, price: 25, isBestSeller: true },
    { id: '3', country: 'عالمي', flag: '🌍', data: '5GB', days: 15, price: 12, isBestSeller: false },
    { id: '4', country: 'الإمارات', flag: '🇦🇪', data: '3GB', days: 7, price: 9, isBestSeller: false },
    { id: '5', country: 'فرنسا', flag: '🇫🇷', data: '10GB', days: 30, price: 18, isBestSeller: true },
    { id: '6', country: 'السعودية', flag: '🇸🇦', data: '5GB', days: 15, price: 14, isBestSeller: false },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              الوجهات الأكثر طلباً
            </h2>
            <p className="text-lg text-slate-600">
              اختر من بين أفضل خطط الإنترنت المختارة بعناية لتناسب رحلتك القادمة.
            </p>
          </div>
          <Link
            to="/plans"
            className="group flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
          >
            عرض جميع الخطط
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100 transition-all group relative overflow-hidden"
            >
              {plan.isBestSeller && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  الأكثر مبيعاً
                </div>
              )}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  {plan.flag}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.country}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <Globe2 className="w-4 h-4" /> تغطية كاملة
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-cyan-500" />
                  <div>
                    <div className="text-xs text-slate-500">البيانات</div>
                    <div className="font-bold text-slate-900">{plan.data}</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-slate-500">المدة</div>
                    <div className="font-bold text-slate-900">{plan.days} أيام</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-sm text-slate-500 mb-1">السعر</div>
                  <div className="text-2xl font-black text-slate-900">${plan.price}</div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors shadow-md">
                  اشتر الآن
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
