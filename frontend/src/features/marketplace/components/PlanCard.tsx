import { motion } from 'framer-motion';
import { Wifi, Clock, Globe2, Heart, ShoppingCart, Zap } from 'lucide-react';
import { useState } from 'react';
import { getCountryImage } from '../../../lib/country-images';

interface PlanCardProps {
  plan: any;
  viewMode: 'grid' | 'list';
  onClick: (plan: any) => void;
}

export function PlanCard({ plan, viewMode, onClick }: PlanCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const EXCHANGE_RATE = 135;
  const priceDZD = (plan.price * EXCHANGE_RATE).toFixed(0);

  // Handle both flat dummy data and nested backend data
  const countryName = plan.country?.nameAr || plan.countryName || plan.name;
  const countryNameEn = plan.country?.nameEn || plan.countryNameEn || '';
  const countryCode = plan.country?.code || plan.countryCode || 'GLOBAL';
  const flag = plan.country?.flag || plan.flag || '🌍';
  const validityDays = plan.validity || plan.validityDays;
  const dataAmount = plan.dataAmount;
  const networkSpeed = plan.speed || plan.networkSpeed || '4G/5G';

  const getBadge = () => {
    if (plan.isBestSeller)
      return { text: 'الأكثر مبيعاً', colors: 'from-orange-400 to-pink-500' };
    if (plan.isNew)
      return { text: 'جديد', colors: 'from-green-400 to-emerald-500' };
    if (plan.isLimited)
      return { text: 'عرض محدود', colors: 'from-red-400 to-rose-600' };
    return null;
  };

  const badge = getBadge();

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onClick(plan)}
        className="bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100 transition-all cursor-pointer flex flex-col md:flex-row overflow-hidden group"
      >
        <div className="md:w-48 h-32 md:h-auto relative overflow-hidden flex-shrink-0">
          <img
            src={getCountryImage(countryCode)}
            alt={countryName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-3xl">{flag}</span>
          </div>
          {badge && (
            <div
              className={`absolute top-3 left-3 bg-gradient-to-r ${badge.colors} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}
            >
              {badge.text}
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {countryName}
              </h3>
              <p className="text-sm text-slate-500">{countryNameEn}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 my-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Wifi className="w-4 h-4 text-cyan-500" />
              <span className="font-bold">
                {dataAmount === -1
                  ? '∞ غير محدود'
                  : `${dataAmount} GB`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{validityDays} يوم</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{networkSpeed}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <div className="text-xl font-black text-slate-900">
                ${plan.price.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">~ {priceDZD} د.ج</div>
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-cyan-600 transition-colors shadow-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> إضافة
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(plan)}
      className="bg-white rounded-3xl border border-slate-100 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-100 transition-all duration-300 group relative overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Country Background Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          src={getCountryImage(countryCode)}
          alt={countryName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-4 w-full px-4 flex justify-between items-start">
          {badge ? (
            <div
              className={`bg-gradient-to-r ${badge.colors} text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md`}
            >
              {badge.text}
            </div>
          ) : (
            <div></div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-red-500/20 text-white rounded-full transition-colors border border-white/20"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </div>

        <div className="absolute bottom-4 px-4 w-full flex items-end gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-3xl shadow-lg border border-slate-100">
            {flag}
          </div>
          <div>
            <h3 className="text-white font-bold text-xl leading-tight">
              {countryName}
            </h3>
            <span className="text-white/70 text-sm font-medium">
              {countryNameEn}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-100 group-hover:border-cyan-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 mb-0.5">البيانات</div>
              <div className="font-bold text-slate-900 text-sm">
                {dataAmount === -1
                  ? '∞ غير محدود'
                  : `${dataAmount} GB`}
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-100 group-hover:border-blue-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 mb-0.5">المدة</div>
              <div className="font-bold text-slate-900 text-sm">
                {validityDays} يوم
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-5 px-1">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
            <Zap className="w-3 h-3 text-yellow-500" /> {networkSpeed}
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-3 h-3" /> يدعم{' '}
            {plan.supportedNetworksCount || 'عدة'} شبكات
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-500 mb-0.5">السعر</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-slate-900 leading-none">
                ${plan.price.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              ~ {priceDZD} د.ج
            </div>
          </div>
          <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
