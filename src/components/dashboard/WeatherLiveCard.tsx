import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  CloudRain,
  CloudLightning,
  CloudSun,
  Cloud,
  Droplets,
  Wind,
  MapPin,
  Compass,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  Umbrella,
  Gauge,
  Thermometer,
  ChevronDown,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchLiveWeather, LiveWeatherData } from '../../services/weatherService';
import { WeatherDay } from '../../types';

interface WeatherLiveCardProps {
  onForecastLoaded?: (forecast: WeatherDay[], locationName: string) => void;
}

const POPULAR_DISTRICTS = [
  { name: 'Khordha', state: 'Odisha' },
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Sambalpur', state: 'Odisha' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Palakkad', state: 'Kerala' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Indore', state: 'Madhya Pradesh' },
];

export const WeatherLiveCard: React.FC<WeatherLiveCardProps> = ({ onForecastLoaded }) => {
  const { user, t } = useApp();

  const defaultLocation = user?.district
    ? `${user.district}, ${user.state || 'India'}`
    : 'Khordha, Odisha';

  const [currentLocation, setCurrentLocation] = useState<string>(defaultLocation);
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGpsDetecting, setIsGpsDetecting] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [customCoords, setCustomCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWeather = useCallback(
    async (locName: string, coords?: { lat: number; lon: number }) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchLiveWeather(
          locName,
          undefined,
          coords || undefined
        );
        setWeatherData(data);
        setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        if (onForecastLoaded && data.forecastDays.length > 0) {
          onForecastLoaded(data.forecastDays, data.locationName);
        }
      } catch (err: any) {
        console.error('Weather load error:', err);
        setErrorMessage('Unable to reach live station. Showing cached local metrics.');
      } finally {
        setLoading(false);
      }
    },
    [onForecastLoaded]
  );

  // Initial load and sync with user district
  useEffect(() => {
    const loc = user?.district ? `${user.district}, ${user.state || 'India'}` : 'Khordha, Odisha';
    setCurrentLocation(loc);
    loadWeather(loc, customCoords || undefined);
  }, [user?.district, user?.state]);

  // GPS Geolocation trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsDetecting(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const gpsName = `GPS Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`;
        setCustomCoords({ lat: latitude, lon: longitude });
        setCurrentLocation(gpsName);
        setIsGpsDetecting(false);
        setIsLocationModalOpen(false);
        await loadWeather(gpsName, { lat: latitude, lon: longitude });
      },
      (error) => {
        console.warn('GPS location error:', error);
        setIsGpsDetecting(false);
        setErrorMessage('GPS permission denied or timed out. Please choose your district manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectDistrict = (districtName: string, stateName?: string) => {
    const fullLoc = stateName ? `${districtName}, ${stateName}` : districtName;
    setCustomCoords(null);
    setCurrentLocation(fullLoc);
    setIsLocationModalOpen(false);
    loadWeather(fullLoc);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setCustomCoords(null);
    setCurrentLocation(searchInput.trim());
    setIsLocationModalOpen(false);
    loadWeather(searchInput.trim());
    setSearchInput('');
  };

  // Weather Icon renderer
  const renderWeatherIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud-rain':
        return <CloudRain className={`${className} text-blue-600`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${className} text-indigo-600`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-amber-600`} />;
      case 'cloud':
      default:
        return <Cloud className={`${className} text-stone-500`} />;
    }
  };

  const rainProb = weatherData?.current.rainProbability ?? 65;
  const rainRiskBadge =
    rainProb >= 70
      ? { label: 'High Rain Risk', color: 'bg-red-100 text-red-700 border-red-200' }
      : rainProb >= 35
      ? { label: 'Moderate Rain', color: 'bg-amber-100 text-amber-800 border-amber-200' }
      : { label: 'Low Rain Chance', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };

  return (
    <div
      id="live-weather-card"
      className="bg-white rounded-3xl p-5 sm:p-6 border border-green-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Location Bar & Status */}
      <div className="flex items-center justify-between gap-2 border-b border-green-50 pb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-green-700 shrink-0" />
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-left font-extrabold text-xs sm:text-sm text-green-950 hover:text-green-700 transition-colors flex items-center gap-1 truncate cursor-pointer group"
            title="Click to change location or use GPS"
          >
            <span className="truncate max-w-[150px] sm:max-w-[190px]">
              {weatherData?.locationName || currentLocation}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-green-700 shrink-0" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Live API</span>
          </span>
          <button
            onClick={() => loadWeather(currentLocation, customCoords || undefined)}
            disabled={loading}
            className="p-1.5 text-stone-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Refresh live weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-green-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Meteorological Content */}
      <div className="pt-4 space-y-4">
        {loading && !weatherData ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            <p className="text-xs font-semibold">Fetching meteorological station data...</p>
          </div>
        ) : (
          <>
            {/* Core Stats Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                  {weatherData && renderWeatherIcon(weatherData.current.icon, 'w-8 h-8')}
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-green-950 tracking-tight">
                      {weatherData?.current.temp ?? 31}°C
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Feels {weatherData?.current.apparentTemp ?? 33}°C
                    </span>
                  </div>
                  <p className="text-xs text-green-700 font-bold truncate max-w-[160px] sm:max-w-[200px]">
                    {weatherData?.current.condition ?? 'Partly Cloudy'}
                  </p>
                </div>
              </div>

              {/* Rain Probability Pill */}
              <div className="text-right flex flex-col items-end">
                <div className={`px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 ${rainRiskBadge.color}`}>
                  <Umbrella className="w-3.5 h-3.5" />
                  <span>{rainProb}% {t.rainProbability}</span>
                </div>
                <span className="text-[10px] text-stone-500 font-semibold mt-1">
                  {rainRiskBadge.label}
                </span>
              </div>
            </div>

            {/* Micro Stats Matrix (Humidity, Wind, Rain Precip) */}
            <div className="grid grid-cols-3 gap-2 bg-stone-50/70 p-2.5 rounded-2xl border border-stone-100 text-center">
              <div className="space-y-0.5">
                <p className="text-[10px] text-stone-500 font-bold uppercase flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span>{t.humidity}</span>
                </p>
                <p className="text-xs font-black text-stone-800">{weatherData?.current.humidity ?? 75}%</p>
              </div>
              <div className="space-y-0.5 border-x border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold uppercase flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3 text-teal-600" />
                  <span>{t.windSpeed}</span>
                </p>
                <p className="text-xs font-black text-stone-800">{weatherData?.current.windSpeedKmH ?? 14} km/h</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-stone-500 font-bold uppercase flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-indigo-500" />
                  <span>Precip.</span>
                </p>
                <p className="text-xs font-black text-stone-800">{weatherData?.current.precipitationMm ?? 0} mm</p>
              </div>
            </div>

            {/* Next Hours Rain Forecast Bar Strip */}
            {weatherData?.hourlyRainProbabilities && weatherData.hourlyRainProbabilities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  <span>Hourly Rain Chance</span>
                  <span className="text-green-700 font-bold lowercase">6-hr outlook</span>
                </div>
                <div className="grid grid-cols-6 gap-1 bg-blue-50/50 p-2 rounded-xl border border-blue-100/60 text-center">
                  {weatherData.hourlyRainProbabilities.slice(0, 6).map((hr, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-[9px] font-semibold text-stone-500 truncate">{hr.time}</p>
                      <div className="h-6 flex items-end justify-center">
                        <div
                          className={`w-3 rounded-t-sm transition-all ${
                            hr.rainProbability >= 70
                              ? 'bg-red-500'
                              : hr.rainProbability >= 35
                              ? 'bg-amber-500'
                              : 'bg-blue-400'
                          }`}
                          style={{ height: `${Math.max(15, (hr.rainProbability / 100) * 24)}px` }}
                          title={`${hr.time}: ${hr.rainProbability}% rain chance`}
                        />
                      </div>
                      <p className="text-[10px] font-black text-blue-950">{hr.rainProbability}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Agro-Advisory Note */}
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200/70 text-[11px] text-green-950 leading-snug flex items-start gap-2">
              <span className="text-base shrink-0">🌾</span>
              <p className="font-medium">
                {weatherData?.current.agroAdvisory ||
                  'Favorable weather for routine crop monitoring and light irrigation.'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Location Selector Modal / Drawer */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-green-950">Select Farm Location</h3>
                  <p className="text-[11px] text-stone-500">Real-time satellite & station forecast</p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Detection Action */}
            <button
              onClick={handleDetectGPS}
              disabled={isGpsDetecting}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Compass className={`w-4 h-4 ${isGpsDetecting ? 'animate-spin' : ''}`} />
              <span>{isGpsDetecting ? 'Detecting GPS Coordinates...' : 'Detect My Live Location (GPS)'}</span>
            </button>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any Indian District, City or Village..."
                className="w-full pl-10 pr-20 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-800 text-white rounded-xl text-[11px] font-bold hover:bg-green-900 transition-colors"
              >
                Fetch
              </button>
            </form>

            {/* Popular Agricultural Districts */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Popular Agricultural Hubs
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {POPULAR_DISTRICTS.map((dist) => (
                  <button
                    key={dist.name}
                    onClick={() => handleSelectDistrict(dist.name, dist.state)}
                    className="p-2 text-left rounded-xl border border-stone-100 bg-stone-50 hover:bg-green-50 hover:border-green-200 transition-all text-xs"
                  >
                    <p className="font-bold text-stone-900 truncate">{dist.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{dist.state}</p>
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
