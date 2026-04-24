import {
  Share2,
  MessageCircle,
  Link as LinkIcon,
  Globe,
  CreditCard,
} from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'الوجهات',
      links: ['أوروبا', 'آسيا', 'أمريكا الشمالية', 'الشرق الأوسط', 'إفريقيا'],
    },
    {
      title: 'الشركة',
      links: [
        'من نحن',
        'الشروط والأحكام',
        'سياسة الخصوصية',
        'سياسة الاسترداد',
        'المدونة',
      ],
    },
    {
      title: 'الدعم',
      links: [
        'مركز المساعدة',
        'الأسئلة الشائعة',
        'تواصل معنا',
        'تفقد حالة الطلب',
        'كيفية التثبيت',
      ],
    },
  ];

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/50 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <img
                src="/soufsim-logo.png"
                alt="SoufSim Logo"
                className="h-24 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <p className="text-slate-500 leading-relaxed mb-6 max-w-sm">
              أول منصة جزائرية وعربية توفر حلول الاتصال الدولي السلس للأفراد
              والشركات بأسعار تنافسية وبدون رسوم مخفية.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h4 className="text-slate-800 font-bold mb-6">{column.title}</h4>
              <ul className="flex flex-col gap-4">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-slate-200/50 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text">
            © {new Date().getFullYear()} SoufSim Marketplace. جميع الحقوق
            محفوظة.
          </p>

          <div className="flex items-center gap-4 opacity-70">
            <div className="px-3 py-1 bg-white rounded flex gap-2">
              <CreditCard className="text-black" />
              <span className="font-bold text-black text-sm">CIB</span>
            </div>
            <div className="px-3 py-1 bg-[#1a1f36] rounded text-slate-800 text-sm font-bold border border-slate-300">
              Stripe
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded text-black text-sm font-bold">
              الذهبية
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
