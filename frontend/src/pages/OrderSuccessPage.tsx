import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Check, QrCode, Download, Mail, Smartphone } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const isMock = searchParams.get('mock') === 'true';

  useEffect(() => {
    // Fire celebratory confetti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#06b6d4', '#ffffff'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#06b6d4', '#ffffff'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-[50%] -translate-x-1/2 w-full h-[50%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/20 relative z-10">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 relative z-10">
              تم الدفع بنجاح!
            </h1>
            <p className="text-slate-500 text-lg mb-8 relative z-10 max-w-md mx-auto">
              شكراً لاختيارك SoufSim. لقد تم إرسال الشريحة الإلكترونية إلى بريدك{' '}
              {isMock ? '(عملية دفع CIBจำลอง)' : ''}
              مع إرشادات التفعيل خطوة بخطوة.
            </p>

            {/* QR Card Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center relative group p-2 mx-auto md:mx-0">
                {/* Simulated QR Pattern block */}
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center opacity-90 mix-blend-multiply filter blur-[1px]"></div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm cursor-pointer">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  QR Code التفعيل
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  للاستمتاع بالإنترنت فوراً، اذهب إلى:
                  <br />
                  الإعدادات &gt; الشبكات &gt; إضافة eSIM
                  <br />
                  ثم قم بمسح الرمز المجاور باستخدام كاميرا الهاتف.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <button className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <Download className="w-5 h-5" /> تحميل الرمز
                  </button>
                  <button className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 font-medium px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                    <Mail className="w-5 h-5" /> إعادة إرسال
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full">
              <Link
                to="/plans"
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-800 font-bold px-8 py-4 rounded-xl hover:scale-[1.02] transition-transform"
              >
                اكتشف باقات أخرى
              </Link>
              <button className="w-full sm:w-auto bg-transparent border border-slate-200 text-slate-800 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <Smartphone className="w-5 h-5" /> الذهاب للوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
