import { ShieldCheck, Lock, HeadphonesIcon, BadgeCent } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: 'متوافق مع GDPR',
      desc: 'بياناتك الشخصية محمية ومؤمنة بالكامل',
    },
    {
      icon: Lock,
      title: 'دفع مشفر 100%',
      desc: 'نستخدم أحدث تقنيات الـ SSL لحماية مدفوعاتك',
    },
    {
      icon: HeadphonesIcon,
      title: 'دعم فني 24/7',
      desc: 'فريقنا متواجد دائماً لمساعدتك في أي وقت',
    },
    {
      icon: BadgeCent,
      title: 'ضمان الاسترداد',
      desc: 'استرداد كامل للمبلغ في حال وجود أي عطل تقني',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-700">
                <badge.icon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{badge.title}</h4>
              <p className="text-sm text-slate-500 max-w-[200px]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
