import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const flags = ['🇫🇷', '🇹🇷', '🇦🇪', '🇺🇸', '🇬🇧', '🇯🇵', '🇪🇸', '🇮🇹'];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-cyan-500/30 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-blue-600/30 rounded-full blur-[100px]"
          />
        </div>
      </div>

      {/* Floating Flags */}
      {flags.map((flag, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [-20, 20, -20],
            x: Math.sin(index) * 50,
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            delay: index * 0.5,
          }}
          className="absolute text-4xl select-none"
          style={{
            left: `${10 + index * 15}%`,
            top: `${20 + (index % 3) * 25}%`,
            zIndex: 1,
          }}
        >
          {flag}
        </motion.div>
      ))}

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            مستقبل الاتصالات الرقمية 🌐
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            اتصل بالعالم <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              بضغطة واحدة
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 font-light">
            eSIM فوري لـ 190+ دولة • لا شرائح مادية • تفعيل آني
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/plans"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>ابدأ الاتصال الآن</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              <span>شاهد كيف يعمل</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-32 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-md py-6 hidden md:block z-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center max-w-5xl mx-auto text-slate-300 font-medium">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">190+</span>
              <span className="text-sm">دولة ومنطقة</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">10M+</span>
              <span className="text-sm">مستخدم سعيد</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">99.9%</span>
              <span className="text-sm">وقت التشغيل (Uptime)</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">4.8★</span>
              <span className="text-sm">متوسط التقييم</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
