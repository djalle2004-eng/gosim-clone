import { DollarSign, ShoppingBag, Users, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardPage() {
  
  const lineData = [
    { name: '1 أفريل', revenue: 4000 },
    { name: '5 أفريل', revenue: 3000 },
    { name: '10 أفريل', revenue: 5000 },
    { name: '15 أفريل', revenue: 9780 },
    { name: '20 أفريل', revenue: 6900 },
    { name: '25 أفريل', revenue: 11000 },
    { name: '30 أفريل', revenue: 14500 },
  ];

  const pieData = [
    { name: 'باقات مفعلة', value: 850 },
    { name: 'قيد الانتظار', value: 120 },
    { name: 'منتهية', value: 340 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const kpis = [
    { label: "إجمالي الإيراد", value: "د.ج 1,245,000", change: "+14.5%", isPositive: true, icon: <DollarSign className="w-6 h-6 text-emerald-400" /> },
    { label: "إجمالي الطلبات", value: "1,432", change: "+5.2%", isPositive: true, icon: <ShoppingBag className="w-6 h-6 text-violet-400" /> },
    { label: "المستخدمون الجدد", value: "850", change: "-2.1%", isPositive: false, icon: <Users className="w-6 h-6 text-orange-400" /> },
    { label: "الـ eSIM النشطة", value: "2,154", change: "+24%", isPositive: true, icon: <Activity className="w-6 h-6 text-cyan-400" /> },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك، أيها المدير 👋</h1>
        <p className="text-gray-400">إليك نظرة عامة على أداء منصة GoSIM هذا الشهر.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5">{kpi.icon}</div>
               <span className={`flex items-center gap-1 text-sm font-bold ${kpi.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                 {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />} {kpi.change}
               </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1 font-medium">{kpi.label}</h3>
            <div className="text-3xl font-black text-white tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Line Chart (2 cols) */}
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">نظرة عامة على الإيرادات (30 يوم)</h3>
          <div className="h-[350px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#22d3ee' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart (1 col) */}
        <div className="lg:col-span-1 bg-card border border-white/5 rounded-3xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">حالة باقات الموزع (Airalo)</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative" dir="ltr">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#12121a', border: '1px solid #ffffff10', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full mt-4 space-y-3" dir="rtl">
              {pieData.map((entry, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-gray-400">{entry.name}</span>
                  </div>
                  <span className="text-white font-bold">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
