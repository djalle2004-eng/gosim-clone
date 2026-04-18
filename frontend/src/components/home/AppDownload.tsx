import { Smartphone } from 'lucide-react';

export default function AppDownload() {
  return (
    <section className="py-24 bg-slate-50 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          {/* Overlay Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cubes.png')",
            }}
          ></div>

          <div className="relative z-10 md:w-1/2 text-center md:text-right mb-10 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              حمل التطبيق واستمتع بإدارة أسهل
            </h2>
            <p className="text-slate-800/80 text-lg mb-8 max-w-md mx-auto md:mx-0">
              تابع استهلاكك للبيانات، اشحن رصيدك، وفعل شرائحك الإلكترونية بضغطة
              زر واحدة أينما كنت.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-slate-800 px-6 py-4 rounded-xl transition-colors">
                <Smartphone className="w-6 h-6" />
                <div className="text-right">
                  <div className="text-xs text-slate-500">احصل عليه من</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </button>

              <button className="flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-slate-800 px-6 py-4 rounded-xl transition-colors">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <div className="text-right">
                  <div className="text-xs text-slate-500">احصل عليه من</div>
                  <div className="font-bold">App Store</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative z-10 md:w-1/3 flex justify-center perspective-1000">
            {/* Mockup iPhone */}
            <div className="w-[200px] md:w-[250px] aspect-[9/19] bg-gray-900 border-[6px] border-black rounded-[2rem] shadow-2xl relative overflow-hidden rotate-y-[-15deg] rotate-[5deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 inset-x-0 h-4 bg-black rounded-b-xl w-1/2 mx-auto z-20"></div>
              <div className="absolute inset-0 bg-slate-50 text-slate-800 p-4 pt-8">
                <div className="w-full h-8 bg-slate-200 rounded mb-4"></div>
                <div className="w-3/4 h-32 bg-cyan-500/20 rounded-xl mb-4 p-3 border border-cyan-500/30">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/50 mb-2"></div>
                  <div className="w-1/2 h-2 bg-slate-1000 rounded mb-2"></div>
                  <div className="w-full h-2 bg-white/20 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full h-20 bg-slate-200 rounded-lg"></div>
                  <div className="w-full h-20 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
