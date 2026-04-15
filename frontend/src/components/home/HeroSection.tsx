import { Search, Globe, Users, Zap, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const stats = [
    { label: '170+ دولة', icon: <Globe className="w-5 h-5 text-cyan-400" /> },
    { label: '50K+ مستخدم', icon: <Users className="w-5 h-5 text-cyan-400" /> },
    { label: 'تفعيل فوري', icon: <Zap className="w-5 h-5 text-cyan-400" /> },
    {
      label: 'دعم 24/7',
      icon: <Headphones className="w-5 h-5 text-cyan-400" />,
    },
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              بدون رسوم تجوال مخفية
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              ابق متصلاً في{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                أكثر من 170 دولة
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0">
              احصل على شريحة إلكترونية (eSIM) في ثوانٍ. لا حاجة لتغيير شريحتك
              الفعلية، استمتع بإنترنت سريع وآمن أينما سافرت.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto lg:mx-0 mb-10 group">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="إلى أين تسافر؟ (مثال: تركيا، فرنسا...)"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-2xl py-5 pr-14 pl-6 text-white text-lg outline-none transition-all placeholder:text-gray-500 shadow-xl"
              />
              <button className="absolute inset-y-2 left-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                ابحث
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {stat.icon}
                  </div>
                  <span className="text-gray-300 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Device Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg relative perspective-1000"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative mx-auto rounded-[3rem] border-[8px] border-gray-900 bg-gray-950 aspect-[9/19] w-3/4 max-w-[320px] shadow-2xl shadow-cyan-500/20 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-1/2 mx-auto z-20"></div>
              {/* App UI Simulation inside the phone */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black p-6 pt-12 flex flex-col items-center">
                <div className="w-full bg-white/10 rounded-2xl p-4 mb-4 border border-white/5">
                  <div className="text-cyan-400 text-sm font-bold mb-1">
                    eSIM فرنسا
                  </div>
                  <div className="text-white text-2xl font-bold mb-2">
                    50 GB
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="text-gray-400 text-xs text-left">
                    {' '}
                    صالحة لمدة 30 يوم
                  </div>
                </div>

                <div className="mt-auto w-full bg-white rounded-2xl p-4 aspect-square flex items-center justify-center relative overflow-hidden group border-4 border-white/10">
                  <div className="w-10/12 h-10/12 bg-gray-900 rounded-lg animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent"></div>
                </div>
                <p className="text-white font-medium mt-4 text-sm bg-white/10 px-4 py-2 rounded-full">
                  امسح لتفعيل الشبكة
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
