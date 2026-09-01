import React from 'react';
import {
  Sun,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Trees,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Send,
  Sliders,
  ChevronRight,
  TrendingDown,
  Building,
  UserCheck,
  Sparkles,
  Wheat,
  Leaf,
  Bug,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockWeatherForecast } from '../../data/mockData';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    setActiveView,
    distressRiskData,
    distressThreshold,
    cropConditionData,
    isOfficerAlertTriggered,
    setIsDistressModalOpen,
    lowBandwidth,
    t,
  } = useApp();

  const todayWeather = mockWeatherForecast[0];

  return (
    <div id="home-farmer-dashboard" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* ===================================================
          MAIN GRID: DISTRESS EARLY WARNING + SMART ADVISORY & WEATHER
          =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ===================================================
            MODULE 2: DISTRESS EARLY WARNING CARD (5 COLS)
            =================================================== */}
        <div
          id="card-distress-early-warning"
          className="lg:col-span-5 bg-white border-2 border-red-100 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden space-y-6 cursor-default"
        >
          {/* Subtle background icon */}
          <div className="absolute top-0 right-0 p-4 opacity-5 text-red-600 pointer-events-none">
            <AlertTriangle className="w-36 h-36" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
              <span>⚠️</span>
              <span>{t.earlyWarningAlert.replace('⚠️ ', '')}</span>
            </div>
            
            <div>
              <h3 className="text-xl font-extrabold text-green-950 mb-1">
                {t.distressRiskTitle}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {t.distressCardSubtitle}
              </p>
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-6xl font-black text-red-600 tracking-tight">
                {distressRiskData.overallRiskPercentage}%
              </span>
              <span className="text-base font-extrabold text-red-500 uppercase tracking-wider">
                {distressRiskData.riskLevel === 'High'
                  ? t.riskLevelHigh
                  : distressRiskData.riskLevel === 'Medium'
                  ? t.riskLevelMedium
                  : t.riskLevelLow}
              </span>
            </div>

            {/* Contributing Factor Rows */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between text-xs items-center border-b border-red-50 pb-2">
                <span className="text-stone-600 font-medium">{t.rainfallDeviation}</span>
                <span className="font-bold text-red-600">{t.rainfallDeviationVal}</span>
              </div>
              <div className="flex justify-between text-xs items-center border-b border-red-50 pb-2">
                <span className="text-stone-600 font-medium">{t.mandiPriceDrop}</span>
                <span className="font-bold text-red-600">{t.mandiPriceDropVal}</span>
              </div>
              <div className="flex justify-between text-xs items-center border-b border-red-50 pb-2">
                <span className="text-stone-600 font-medium">{t.kccLoanProximity}</span>
                <span className="font-bold text-amber-600">{t.kccLoanProximityVal}</span>
              </div>
              <div className="flex justify-between text-xs items-center border-b border-red-50 pb-2">
                <span className="text-stone-600 font-medium">{t.cropStressIndex}</span>
                <span className="font-bold text-stone-700">{t.cropStressIndexVal}</span>
              </div>
            </div>

            {/* Interactive Vector Tweaker Button */}
            <button
              id="distress-open-simulator-btn"
              onClick={() => setIsDistressModalOpen(true)}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200/80 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.simulateVectorsBtn}</span>
            </button>
          </div>

          {/* Local Agricultural Officer Alert Dispatch Status */}
          <div className="pt-4 border-t border-red-100 relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-green-800 font-bold bg-green-50 border border-green-200/70 p-3 rounded-xl">
              <Check className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs uppercase tracking-wide">
                {t.officerAlertSentLogged}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 px-1 flex justify-between items-center">
              <span>{t.officerLabel}: {distressRiskData.officerAlertStatus.officerName}</span>
              <span className="font-mono text-green-700 font-semibold">{distressRiskData.officerAlertStatus.officerContact}</span>
            </div>
          </div>
        </div>

        {/* ===================================================
            MODULE 1: SMART ADVISORY + WEATHER (7 COLS)
            =================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top 2 Cards: Weather & Crop Health */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Weather Card */}
            <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-default">
              <div>
                <h4 className="text-xs uppercase font-bold text-green-600 mb-4 tracking-widest">
                  {t.weatherTitle}
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-3xl">
                    🌧️
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-green-950">
                      {t.rainProbability}: {todayWeather.rainProbability}%
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      32°C • {todayWeather.condition}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-green-50 text-[11px] text-stone-500">
                {t.humidity}: <strong className="text-stone-700">{todayWeather.humidity}%</strong> • {t.windSpeed}: <strong className="text-stone-700">{todayWeather.windSpeedKmH} km/h</strong>
              </div>
            </div>

            {/* Crop Health Card */}
            <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-default">
              <div>
                <h4 className="text-xs uppercase font-bold text-green-600 mb-4 tracking-widest">
                  {t.cropHealthTitle}
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 border border-green-200 rounded-2xl flex items-center justify-center text-green-700 shrink-0">
                    <Leaf className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-green-950">
                      {t.cropStatus}: {cropConditionData.statusLabel}
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      {t.vegetativeStageAcres}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-green-50 flex items-center justify-between text-xs font-bold text-green-700">
                <button
                  onClick={() => setActiveView('disease')}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.openDiseaseScanner}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Daily Farming Advice Hero Card (Signature Clean Minimalism Green Block) */}
          <div className="bg-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-default">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs uppercase font-bold text-green-200 tracking-widest">
                {t.todaysAdvice}
              </h4>

              <ul className="space-y-3.5">
                <li className="flex items-start gap-3.5">
                  <span className="w-6 h-6 bg-green-700 text-green-100 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-sm sm:text-base leading-snug">
                    {t.farmingAdvice1}
                  </p>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-6 h-6 bg-green-700 text-green-100 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-sm sm:text-base leading-snug">
                    {t.farmingAdvice2}
                  </p>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-6 h-6 bg-green-700 text-green-100 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="text-sm sm:text-base leading-snug">
                    {t.farmingAdvice3}
                  </p>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="bg-yellow-400 text-green-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-yellow-300 transition-colors cursor-pointer"
                >
                  {t.compareMandiPricesBtn}
                </button>
                <button
                  onClick={() => setActiveView('disease')}
                  className="bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {t.checkCropHealthLabBtn}
                </button>
              </div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>

        </div>

      </div>

      {/* ===================================================
          BOTTOM SECTION: HARVEST TIMING & 5-DAY WEATHER ROW
          =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Best Time to Harvest Card */}
        <section className="lg:col-span-6 bg-white rounded-3xl border border-green-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 space-y-4 cursor-default">
          <div className="flex items-center justify-between border-b border-green-50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-green-950 leading-tight">
                  {t.bestTimeToHarvest}
                </h2>
                <p className="text-xs text-green-600">Maturity & Moisture Sensor Model</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              ~{cropConditionData.harvestForecast.daysToHarvest} Days Left
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50/70 border border-green-100 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-green-700 font-semibold">{t.estimatedPeriod}</div>
              <div className="text-sm font-extrabold text-green-950">
                {cropConditionData.harvestForecast.estimatedPeriod}
              </div>
              <div className="text-[11px] text-green-600 font-medium">Optimal Window</div>
            </div>

            <div className="bg-green-50/70 border border-green-100 rounded-2xl p-3.5 space-y-1">
              <div className="text-xs text-green-700 font-semibold">{t.recommendedDate}</div>
              <div className="text-sm font-extrabold text-green-800">
                {cropConditionData.harvestForecast.recommendedDate}
              </div>
              <div className="text-[11px] text-green-600 font-medium">Post 85% Golden Canopy</div>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/80">
            <strong>Scientific Advice:</strong> {cropConditionData.harvestForecast.explanation}
          </p>
        </section>

        {/* 5-Day Weather Forecast Strip */}
        <section className="lg:col-span-6 bg-white rounded-3xl border border-green-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 space-y-4 cursor-default">
          <div className="flex items-center justify-between border-b border-green-50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-green-950 leading-tight">
                  {t.forecast5Days}
                </h2>
                <p className="text-xs text-green-600">Khordha District Agro-Station</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Daily Outlook
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {mockWeatherForecast.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                  idx === 0
                    ? 'bg-green-100/70 border-green-300 font-bold'
                    : 'bg-green-50/40 border-green-100 hover:bg-green-50'
                }`}
              >
                <div className="text-xs text-green-900 font-semibold">{day.day}</div>
                <div className="flex justify-center text-blue-600 py-0.5">
                  {day.icon === 'sun' ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="text-xs font-bold text-green-950">{day.tempMax}°</div>
                <div className="text-[10px] text-blue-700 font-bold">{day.rainProbability}%</div>
              </div>
            ))}
          </div>

          <div className="bg-green-50/70 border border-green-100 rounded-xl p-3 text-xs text-green-900 leading-snug">
            🌾 <strong>Agro Advice:</strong> Soil moisture is optimum for nitrogen top-dressing before expected rains.
          </div>
        </section>

      </div>

    </div>
  );
};
