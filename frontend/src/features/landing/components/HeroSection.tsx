import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const flags = [
    { emoji: '🇫🇷', code: 'FR' },
    { emoji: '🇹🇷', code: 'TR' },
    { emoji: '🇦🇪', code: 'AE' },
    { emoji: '🇺🇸', code: 'US' },
    { emoji: '🇬🇧', code: 'GB' },
    { emoji: '🇯🇵', code: 'JP' },
    { emoji: '🇪🇸', code: 'ES' },
    { emoji: '🇮🇹', code: 'IT' },
  ];

  return (
    <section className="relative flex flex-col overflow-hidden bg-slate-900 pt-32 lg:pt-48">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Floating Background Flags */}
      {flags.map((flag, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [-15, 25, -15],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 12 + index,
            repeat: Infinity,
            delay: index * 0.5,
            ease: 'easeInOut',
          }}
          className="absolute text-5xl md:text-6xl select-none pointer-events-none hidden sm:block"
          style={{
            left: `${5 + index * 12}%`,
            top: `${10 + (index % 4) * 20}%`,
            zIndex: 0,
          }}
        >
          {flag.emoji}
        </motion.div>
      ))}

      {/* Main Content Area */}
      <div className="flex-1 container relative z-10 mx-auto px-4 md:px-6 text-center pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
            مستقبل الاتصالات الرقمية 🌐
          </span>
          <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 leading-tight">
            اتصل بالعالم <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              بضغطة واحدة
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light max-w-2xl mx-auto">
            eSIM فوري لـ 190+ دولة • لا شرائح مادية • تفعيل آني
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Link
              to="/plans"
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 group"
            >
              <span>ابدأ الاتصال الآن</span>
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold text-xl backdrop-blur-md transition-all flex items-center justify-center gap-3">
              <Play className="w-6 h-6 fill-white" />
              <span>شاهد كيف يعمل</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Bar - Now in Flex Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative w-full border-t border-white/10 bg-black/40 backdrop-blur-2xl py-10 z-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center max-w-5xl mx-auto gap-8 md:gap-4 text-slate-300 font-medium">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                190+
              </span>
              <span className="text-sm uppercase tracking-wider opacity-60">
                دولة ومنطقة
              </span>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                10M+
              </span>
              <span className="text-sm uppercase tracking-wider opacity-60">
                مستخدم سعيد
              </span>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                99.9%
              </span>
              <span className="text-sm uppercase tracking-wider opacity-60">
                وقت التشغيل
              </span>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                4.8★
              </span>
              <span className="text-sm uppercase tracking-wider opacity-60">
                متوسط التقييم
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
