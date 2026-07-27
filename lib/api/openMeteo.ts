export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country: string;
  admin1?: string; // State / Region
  timezone?: string;
  population?: number;
}

export interface WeatherData {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    isDay: boolean;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
    pressure: number;
    precipitation: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
    dewPoint: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    pop: number; // precipitation probability %
    precipitation: number;
    weatherCode: number;
    uvIndex: number;
    windSpeed: number;
  }>;
  daily: Array<{
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
    popMax: number;
    precipitationSum: number;
    windSpeedMax: number;
  }>;
}

export interface AirQualityData {
  aqi: number; // US AQI (0 - 500)
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  uvIndex: number;
  pollen: {
    alder: number;
    birch: number;
    grass: number;
    ragweed: number;
    olive: number;
  };
  hourlyAqi: Array<{
    time: string;
    aqi: number;
    pm2_5: number;
    pm10: number;
  }>;
}

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Open-Meteo geocoding error:', error);
    return [];
  }
}

export async function fetchOpenMeteoWeather(
  lat: number,
  lon: number,
  locationName: string = 'Current Location',
  countryName: string = ''
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=10&timezone=auto`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  const c = data.current || {};
  const h = data.hourly || {};
  const d = data.daily || {};

  // Build hourly (next 48 hours)
  const hourly: WeatherData['hourly'] = [];
  const hourlyTimes: string[] = h.time || [];
  const currentIdx = Math.max(0, hourlyTimes.findIndex((t: string) => new Date(t) >= new Date()) - 1);
  
  for (let i = currentIdx; i < Math.min(hourlyTimes.length, currentIdx + 48); i++) {
    hourly.push({
      time: hourlyTimes[i],
      temp: h.temperature_2m?.[i] ?? 0,
      feelsLike: h.apparent_temperature?.[i] ?? 0,
      humidity: h.relative_humidity_2m?.[i] ?? 0,
      pop: h.precipitation_probability?.[i] ?? 0,
      precipitation: h.precipitation?.[i] ?? 0,
      weatherCode: h.weather_code?.[i] ?? 0,
      uvIndex: h.uv_index?.[i] ?? 0,
      windSpeed: h.wind_speed_10m?.[i] ?? 0,
    });
  }

  // Build daily (10 days)
  const daily: WeatherData['daily'] = [];
  const dailyDates: string[] = d.time || [];
  for (let i = 0; i < dailyDates.length; i++) {
    daily.push({
      date: dailyDates[i],
      weatherCode: d.weather_code?.[i] ?? 0,
      tempMax: d.temperature_2m_max?.[i] ?? 0,
      tempMin: d.temperature_2m_min?.[i] ?? 0,
      sunrise: d.sunrise?.[i] ?? '',
      sunset: d.sunset?.[i] ?? '',
      uvIndexMax: d.uv_index_max?.[i] ?? 0,
      popMax: d.precipitation_probability_max?.[i] ?? 0,
      precipitationSum: d.precipitation_sum?.[i] ?? 0,
      windSpeedMax: d.wind_speed_10m_max?.[i] ?? 0,
    });
  }

  const currentUv = h.uv_index?.[currentIdx] ?? 0;
  const currentVis = (h.visibility?.[currentIdx] ?? 10000) / 1000; // km
  const currentDew = h.dew_point_2m?.[currentIdx] ?? 0;

  return {
    location: {
      name: locationName,
      latitude: lat,
      longitude: lon,
      country: countryName,
    },
    current: {
      temp: c.temperature_2m ?? 20,
      feelsLike: c.apparent_temperature ?? 20,
      humidity: c.relative_humidity_2m ?? 50,
      isDay: Boolean(c.is_day ?? 1),
      weatherCode: c.weather_code ?? 0,
      windSpeed: c.wind_speed_10m ?? 10,
      windDirection: c.wind_direction_10m ?? 180,
      windGusts: c.wind_gusts_10m ?? 15,
      pressure: c.pressure_msl ?? 1013,
      precipitation: c.precipitation ?? 0,
      cloudCover: c.cloud_cover ?? 10,
      uvIndex: currentUv,
      visibility: currentVis,
      dewPoint: currentDew,
    },
    hourly,
    daily,
  };
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen,olive_pollen&hourly=us_aqi,pm10,pm2_5,ozone&forecast_days=3&timezone=auto`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`Air quality fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  const c = data.current || {};
  const h = data.hourly || {};

  const hourlyAqi: AirQualityData['hourlyAqi'] = [];
  const times: string[] = h.time || [];
  for (let i = 0; i < Math.min(times.length, 24); i++) {
    hourlyAqi.push({
      time: times[i],
      aqi: h.us_aqi?.[i] ?? 20,
      pm2_5: h.pm2_5?.[i] ?? 5,
      pm10: h.pm10?.[i] ?? 10,
    });
  }

  return {
    aqi: c.us_aqi ?? 35,
    pm2_5: c.pm2_5 ?? 8.5,
    pm10: c.pm10 ?? 14.2,
    co: c.carbon_monoxide ?? 210,
    no2: c.nitrogen_dioxide ?? 12.4,
    so2: c.sulphur_dioxide ?? 3.1,
    o3: c.ozone ?? 45.0,
    uvIndex: c.uv_index ?? 5.2,
    pollen: {
      alder: c.alder_pollen ?? 2,
      birch: c.birch_pollen ?? 1,
      grass: c.grass_pollen ?? 5,
      ragweed: c.ragweed_pollen ?? 0,
      olive: c.olive_pollen ?? 0,
    },
    hourlyAqi,
  };
}
