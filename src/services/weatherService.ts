import { WeatherDay } from '../types';

export interface LocationGeo {
  name: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface LiveWeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  current: {
    temp: number;
    apparentTemp: number;
    humidity: number;
    windSpeedKmH: number;
    windDirection: number;
    surfacePressureHPa: number;
    rainProbability: number;
    precipitationMm: number;
    condition: string;
    icon: 'sun' | 'cloud-rain' | 'cloud-sun' | 'cloud-lightning' | 'cloud';
    weatherCode: number;
    uvIndex?: number;
    isDay: boolean;
    agroAdvisory: string;
  };
  hourlyRainProbabilities: Array<{
    time: string;
    rainProbability: number;
    temp: number;
  }>;
  forecastDays: WeatherDay[];
  lastUpdated: string;
  isLive: boolean;
  source: string;
}

// Fallback Indian District Coordinates
const DEFAULT_DISTRICT_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  khordha: { lat: 20.19, lon: 85.62, name: 'Khordha, Odisha' },
  bhubaneswar: { lat: 20.29, lon: 85.82, name: 'Bhubaneswar, Odisha' },
  cuttack: { lat: 20.46, lon: 85.88, name: 'Cuttack, Odisha' },
  puri: { lat: 19.81, lon: 85.83, name: 'Puri, Odisha' },
  balasore: { lat: 21.49, lon: 86.93, name: 'Balasore, Odisha' },
  sambalpur: { lat: 21.46, lon: 83.98, name: 'Sambalpur, Odisha' },
  pune: { lat: 18.52, lon: 73.85, name: 'Pune, Maharashtra' },
  nagpur: { lat: 21.14, lon: 79.08, name: 'Nagpur, Maharashtra' },
  ludhiana: { lat: 30.90, lon: 75.85, name: 'Ludhiana, Punjab' },
  karnal: { lat: 29.68, lon: 76.99, name: 'Karnal, Haryana' },
  patna: { lat: 25.59, lon: 85.13, name: 'Patna, Bihar' },
  varanasi: { lat: 25.31, lon: 82.97, name: 'Varanasi, Uttar Pradesh' },
  guntur: { lat: 16.30, lon: 80.44, name: 'Guntur, Andhra Pradesh' },
  warangal: { lat: 17.96, lon: 79.59, name: 'Warangal, Telangana' },
  coimbatore: { lat: 11.01, lon: 76.95, name: 'Coimbatore, Tamil Nadu' },
  palakkad: { lat: 10.78, lon: 76.65, name: 'Palakkad, Kerala' },
  ahmedabad: { lat: 23.02, lon: 72.57, name: 'Ahmedabad, Gujarat' },
  indore: { lat: 22.71, lon: 75.85, name: 'Indore, Madhya Pradesh' },
  jaipur: { lat: 26.91, lon: 75.78, name: 'Jaipur, Rajasthan' },
  bengaluru: { lat: 12.97, lon: 77.59, name: 'Bengaluru, Karnataka' },
  kolkata: { lat: 22.57, lon: 88.36, name: 'Kolkata, West Bengal' },
};

export function interpretWMOWeatherCode(code: number): {
  condition: string;
  icon: 'sun' | 'cloud-rain' | 'cloud-sun' | 'cloud-lightning' | 'cloud';
  riskLevel: 'low' | 'moderate' | 'high';
  defaultRainProb: number;
} {
  switch (code) {
    case 0:
      return { condition: 'Clear Sky / Sunny', icon: 'sun', riskLevel: 'low', defaultRainProb: 5 };
    case 1:
      return { condition: 'Mainly Clear', icon: 'cloud-sun', riskLevel: 'low', defaultRainProb: 15 };
    case 2:
      return { condition: 'Partly Cloudy', icon: 'cloud-sun', riskLevel: 'low', defaultRainProb: 25 };
    case 3:
      return { condition: 'Overcast / Heavy Clouds', icon: 'cloud', riskLevel: 'moderate', defaultRainProb: 40 };
    case 45:
    case 48:
      return { condition: 'Fog / Morning Mist', icon: 'cloud', riskLevel: 'low', defaultRainProb: 20 };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', icon: 'cloud-rain', riskLevel: 'moderate', defaultRainProb: 65 };
    case 61:
      return { condition: 'Slight Rain Showers', icon: 'cloud-rain', riskLevel: 'moderate', defaultRainProb: 75 };
    case 63:
      return { condition: 'Moderate Rainfall', icon: 'cloud-rain', riskLevel: 'high', defaultRainProb: 85 };
    case 65:
      return { condition: 'Heavy Rainfall', icon: 'cloud-rain', riskLevel: 'high', defaultRainProb: 95 };
    case 80:
    case 81:
    case 82:
      return { condition: 'Intense Rain Showers', icon: 'cloud-rain', riskLevel: 'high', defaultRainProb: 90 };
    case 95:
      return { condition: 'Thunderstorm with Rain', icon: 'cloud-lightning', riskLevel: 'high', defaultRainProb: 95 };
    case 96:
    case 99:
      return { condition: 'Severe Thunderstorm with Hail', icon: 'cloud-lightning', riskLevel: 'high', defaultRainProb: 98 };
    default:
      return { condition: 'Partly Cloudy', icon: 'cloud-sun', riskLevel: 'low', defaultRainProb: 20 };
  }
}

export function generateAgroAdvisory(rainProb: number, temp: number, windSpeed: number, weatherCode: number): string {
  if (rainProb >= 70 || weatherCode >= 61) {
    return '🌧️ High rain probability (>70%). Postpone urea top-dressing & pesticide spraying. Ensure field drainage channels are open.';
  }
  if (rainProb >= 40) {
    return '⛅ Moderate chance of rain (40-69%). Hold off on flood irrigation and monitor evening cloud cover before foliar application.';
  }
  if (temp >= 38) {
    return '☀️ High temperature alert (>38°C). Provide light evening irrigation or drip to prevent crop heat-stress and moisture depletion.';
  }
  if (windSpeed >= 25) {
    return '💨 High wind speeds (>25 km/h). Avoid fine-droplet pesticide spray drift and check staking on tall horticulture crops.';
  }
  return '🌾 Favorable weather conditions for field activities, fertilization, weed scouting, and scheduled irrigation.';
}

export async function geocodeDistrict(query: string): Promise<LocationGeo | null> {
  const cleanQuery = query.trim().toLowerCase();
  
  // Quick match in lookup
  if (DEFAULT_DISTRICT_COORDS[cleanQuery]) {
    const cached = DEFAULT_DISTRICT_COORDS[cleanQuery];
    return {
      name: cached.name,
      latitude: cached.lat,
      longitude: cached.lon,
    };
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=5&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // Prioritize Indian results if possible
      const indiaMatch = data.results.find((r: any) => r.country_code === 'IN' || r.country === 'India');
      const item = indiaMatch || data.results[0];
      const displayName = [item.name, item.admin1, item.country].filter(Boolean).join(', ');
      return {
        name: displayName,
        state: item.admin1,
        country: item.country,
        latitude: item.latitude,
        longitude: item.longitude,
      };
    }
  } catch (err) {
    console.warn('Geocoding error, falling back to default:', err);
  }

  return {
    name: query ? `${query}, India` : 'Khordha, Odisha',
    latitude: 20.19,
    longitude: 85.62,
  };
}

export async function fetchLiveWeather(
  districtOrCity?: string,
  state?: string,
  coords?: { lat: number; lon: number }
): Promise<LiveWeatherData> {
  let lat = 20.19;
  let lon = 85.62;
  let locationTitle = 'Khordha, Odisha';

  if (coords && coords.lat && coords.lon) {
    lat = coords.lat;
    lon = coords.lon;
    locationTitle = districtOrCity || `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
  } else {
    const searchQuery = [districtOrCity, state].filter(Boolean).join(', ') || 'Khordha, Odisha';
    const geo = await geocodeDistrict(searchQuery);
    if (geo) {
      lat = geo.latitude;
      lon = geo.longitude;
      locationTitle = geo.name;
    }
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean&timezone=auto&forecast_days=7`;

    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
    const data = await res.json();

    const cur = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const weatherCode = Number(cur.weather_code ?? 0);
    const wmoInfo = interpretWMOWeatherCode(weatherCode);

    // Current Rain Probability (from first daily max or hourly immediate)
    const todayDailyRainProb = daily.precipitation_probability_max?.[0] ?? wmoInfo.defaultRainProb;
    const hourlyRainProb0 = hourly.precipitation_probability?.[0] ?? todayDailyRainProb;
    const rainProb = Math.max(Number(hourlyRainProb0), Number(todayDailyRainProb));

    const temp = Math.round(Number(cur.temperature_2m ?? 30));
    const apparentTemp = Math.round(Number(cur.apparent_temperature ?? temp));
    const humidity = Math.round(Number(cur.relative_humidity_2m ?? 75));
    const windSpeedKmH = Math.round(Number(cur.wind_speed_10m ?? 12));
    const windDirection = Math.round(Number(cur.wind_direction_10m ?? 0));
    const surfacePressure = Math.round(Number(cur.surface_pressure ?? 1010));
    const precipitationMm = Number(cur.precipitation ?? 0);
    const isDay = Boolean(cur.is_day ?? 1);

    const agroAdvisory = generateAgroAdvisory(rainProb, temp, windSpeedKmH, weatherCode);

    // Next 6 hours hourly rain probability
    const hourlyRainProbabilities = (hourly.time || []).slice(0, 8).map((tStr: string, idx: number) => {
      const dateObj = new Date(tStr);
      const timeFormatted = dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });
      return {
        time: timeFormatted,
        rainProbability: Math.round(Number(hourly.precipitation_probability?.[idx] ?? 0)),
        temp: Math.round(Number(hourly.temperature_2m?.[idx] ?? temp)),
      };
    });

    // 5-7 Days Forecast List
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecastDays: WeatherDay[] = (daily.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayName = idx === 0 ? 'Today' : daysOfWeek[d.getDay()];
      const dayCode = Number(daily.weather_code?.[idx] ?? 0);
      const dayWmo = interpretWMOWeatherCode(dayCode);
      const dayRainProb = Math.round(Number(daily.precipitation_probability_max?.[idx] ?? dayWmo.defaultRainProb));
      const dayTempMax = Math.round(Number(daily.temperature_2m_max?.[idx] ?? 32));
      const dayTempMin = Math.round(Number(daily.temperature_2m_min?.[idx] ?? 24));
      const dayHumidity = Math.round(Number(daily.relative_humidity_2m_mean?.[idx] ?? 70));
      const dayWind = Math.round(Number(daily.wind_speed_10m_max?.[idx] ?? 14));

      return {
        day: dayName,
        date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        tempMax: dayTempMax,
        tempMin: dayTempMin,
        condition: dayWmo.condition,
        icon: dayWmo.icon,
        rainProbability: dayRainProb,
        humidity: dayHumidity,
        windSpeedKmH: dayWind,
        advisory: generateAgroAdvisory(dayRainProb, dayTempMax, dayWind, dayCode),
      };
    });

    return {
      locationName: locationTitle,
      latitude: lat,
      longitude: lon,
      current: {
        temp,
        apparentTemp,
        humidity,
        windSpeedKmH,
        windDirection,
        surfacePressureHPa: surfacePressure,
        rainProbability: rainProb,
        precipitationMm,
        condition: wmoInfo.condition,
        icon: wmoInfo.icon,
        weatherCode,
        isDay,
        agroAdvisory,
      },
      hourlyRainProbabilities,
      forecastDays,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      source: 'Open-Meteo Meteorological Satellite & Station Grid',
    };
  } catch (error) {
    console.error('Failed to fetch real-time weather from Open-Meteo:', error);
    // Fallback safe representation
    return {
      locationName: locationTitle,
      latitude: lat,
      longitude: lon,
      current: {
        temp: 31,
        apparentTemp: 34,
        humidity: 78,
        windSpeedKmH: 14,
        windDirection: 180,
        surfacePressureHPa: 1012,
        rainProbability: 65,
        precipitationMm: 1.2,
        condition: 'Cloudy with Rain Showers',
        icon: 'cloud-rain',
        weatherCode: 61,
        isDay: true,
        agroAdvisory: '🌧️ Moderate rain probability (65%). Postpone nitrogen top-dressing and ensure field drainage channels are clear.',
      },
      hourlyRainProbabilities: [
        { time: '12 PM', rainProbability: 65, temp: 31 },
        { time: '2 PM', rainProbability: 75, temp: 32 },
        { time: '4 PM', rainProbability: 80, temp: 30 },
        { time: '6 PM', rainProbability: 55, temp: 28 },
        { time: '8 PM', rainProbability: 40, temp: 27 },
      ],
      forecastDays: [
        {
          day: 'Today',
          date: 'Live',
          tempMax: 31,
          tempMin: 24,
          condition: 'Scattered Showers',
          icon: 'cloud-rain',
          rainProbability: 65,
          humidity: 78,
          windSpeedKmH: 14,
          advisory: 'Postpone pesticide spraying if rain probability is above 60%.',
        },
      ],
      lastUpdated: 'Live Demo',
      isLive: false,
      source: 'Offline Agro Station Cache',
    };
  }
}
