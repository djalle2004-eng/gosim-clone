import { motion } from 'framer-motion';
import { Wifi, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCountryImage } from '../../../lib/country-images';

export function FeaturedPlansSection() {
  const plans = [
    {
      id: '1',
      country: 'تركيا',
      code: 'TR',
      flag: '🇹🇷',
      data: '10GB',
      days: 30,
      price: 15,
      isBestSeller: true,
    },
    {
      id: '2',
      country: 'أوروبا',
      code: 'EU',
      flag: '🇪🇺',
      data: '20GB',
      days: 30,
      price: 25,
      isBestSeller: true,
    },
    {
      id: '3',
      country: 'عالمي',
      code: 'GLOBAL',
      flag: '🌍',
      data: '5GB',
      days: 15,
      price: 12,
      isBestSeller: false,
    },
    {
      id: '4',
      country: 'الإمارات',
      code: 'AE',
      flag: '🇦🇪',
      data: '3GB',
      days: 7,
      price: 9,
      isBestSeller: false,
    },
    {
      id: '5',
      country: 'فرنسا',
      code: 'FR',
      flag: '🇫🇷',
      data: '10GB',
      days: 30,
      price: 18,
      isBestSeller: true,
    },
    {
      id: '6',
      country: 'السعودية',
      code: 'SA',
      flag: '🇸🇦',
      data: '5GB',
      days: 15,
      price: 14,
      isBestSeller: false,
    },
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
              اختر من بين أفضل خطط الإنترنت المختارة بعناية لتناسب رحلتك
              القادمة.
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
              className="bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100 transition-all group relative overflow-hidden flex flex-col"
            >
              {/* Country Background Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={getCountryImage(plan.code)}
                  alt={plan.country}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                  <span className="text-2xl">{plan.flag}</span>
                  <h3 className="text-white font-bold text-lg">
                    {plan.country}
                  </h3>
                </div>
                {plan.isBestSeller && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    الأكثر مبيعاً
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-cyan-500" />
                    <div>
                      <div className="text-[10px] text-slate-500">البيانات</div>
                      <div className="font-bold text-slate-900 text-sm">
                        {plan.data}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-[10px] text-slate-500">المدة</div>
                      <div className="font-bold text-slate-900 text-sm">
                        {plan.days} أيام
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div>
                    <div className="text-[10px] text-slate-500">السعر</div>
                    <div className="text-2xl font-black text-slate-900">
                      ${plan.price}
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-cyan-600 transition-colors shadow-sm">
                    اشتر الآن
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
