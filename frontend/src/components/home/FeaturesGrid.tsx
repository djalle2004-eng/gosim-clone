import {
  Zap,
  DollarSign,
  ShieldCheck,
  SignalHigh,
  HeadphonesIcon,
  Globe2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Zap />,
      title: 'تفعيل فوري بالـ QR',
      desc: 'استلم الشريحة الإلكترونية الخاصة بك عبر البريد ثانية واحدة بعد الدفع.',
    },
    {
      icon: <DollarSign />,
      title: 'أسعار تنافسية بالدينار',
      desc: 'لا رسوم تجوال باهظة بعد الآن. ادفع بالدينار الجزائري وبطرق دفع محلية.',
    },
    {
      icon: <ShieldCheck />,
      title: 'دفع آمن 100%',
      desc: 'حماية تامة لبياناتك البنكية بتشفير عالي موثق عالميا.',
    },
    {
      icon: <SignalHigh />,
      title: 'شبكات 4G/5G سريعة',
      desc: 'نحن نتعامل مع أفضل مزودي الاتصال في العالم لضمان سرعة فائقة.',
    },
    {
      icon: <HeadphonesIcon />,
      title: 'دعم 24/7 بالعربية',
      desc: 'فريق الدعم لدينا مستعد دوماً لمساعدتك في أي وقت وأي مكان.',
    },
    {
      icon: <Globe2 />,
      title: '170+ وجهة حول العالم',
      desc: 'سواء كنت في إفريقيا، أوروبا أو آسيا الانترنت دائماً في جيبك.',
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            لماذا تختار <span className="text-cyan-400">SoufSim</span>؟
          </h2>
          <p className="text-slate-500 text-lg">
            بنينا هذه المنصة خصيصاً للمسافر الذكي الذي يبحث عن الفعالية والأمان.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-white/90 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl hover:border-cyan-500/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform group-hover:bg-cyan-500/10">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
