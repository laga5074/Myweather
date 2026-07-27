'use client';

import React, { useState, useEffect } from 'react';
import WeatherSearch from '../../components/weather/WeatherSearch';
import CurrentConditions from '../../components/weather/CurrentConditions';
import HourlyForecast from '../../components/weather/HourlyForecast';
import DailyForecast from '../../components/weather/DailyForecast';
import AirQualityCard from '../../components/weather/AirQualityCard';
import RadarMap from '../../components/weather/RadarMap';
import AlertBanner from '../../components/weather/AlertBanner';
import CommentSection from '../../components/comments/CommentSection';
import BreadcrumbSchema from '../../components/seo/BreadcrumbSchema';
import FaqSchema from '../../components/seo/FaqSchema';
import { WeatherData } from '../../lib/api/openMeteo';
import { AirQualityData } from '../../lib/api/openMeteo';
import { NWSAlert } from '../../lib/api/nws';
import { Cloud, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [lat, setLat] = useState<number>(51.5074);
  const [lon, setLon] = useState<number>(-0.1278);
  const [locationName, setLocationName] = useState<string>('London');
  const [country, setCountry] = useState<string>('United Kingdom');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [alerts, setAlerts] = useState<NWSAlert[]>([]);
  const [providerUsed, setProviderUsed] = useState<string>('Open-Meteo Load Balancer');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (latitude: number, longitude: number, name: string, cntry: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, aqRes, alertRes] = await Promise.all([
        fetch(`/api/weather?lat=${latitude}&lon=${longitude}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(cntry)}`),
        fetch(`/api/air-quality?lat=${latitude}&lon=${longitude}`),
        fetch(`/api/alerts?lat=${latitude}&lon=${longitude}`),
      ]);

      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        setWeather(wData.weather);
        if (wData.providerUsed) setProviderUsed(wData.providerUsed);
      }

      if (aqRes.ok) {
        const aqData = await aqRes.json();
        setAirQuality(aqData.airQuality);
      }

      if (alertRes.ok) {
        const alData = await alertRes.json();
        setAlerts(alData.alerts || []);
      }
    } catch (err: any) {
      console.error('Home page load error:', err);
      setError('Unable to load weather data. Please try another location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [weatherRes, aqRes, alertRes] = await Promise.all([
          fetch(`/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(locationName)}&country=${encodeURIComponent(country)}`),
          fetch(`/api/air-quality?lat=${lat}&lon=${lon}`),
          fetch(`/api/alerts?lat=${lat}&lon=${lon}`),
        ]);

        if (weatherRes.ok && !ignore) {
          const wData = await weatherRes.json();
          setWeather(wData.weather);
          if (wData.providerUsed) setProviderUsed(wData.providerUsed);
        }

        if (aqRes.ok && !ignore) {
          const aqData = await aqRes.json();
          setAirQuality(aqData.airQuality);
        }

        if (alertRes.ok && !ignore) {
          const alData = await alertRes.json();
          setAlerts(alData.alerts || []);
        }
      } catch (err: any) {
        if (!ignore) {
          console.error('Home page load error:', err);
          setError('Unable to load weather data. Please try another location.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [lat, lon, locationName, country]);

  const handleSelectLocation = (loc: { lat: number; lon: number; name: string; country: string }) => {
    setLat(loc.lat);
    setLon(loc.lon);
    setLocationName(loc.name);
    setCountry(loc.country);
    loadData(loc.lat, loc.lon, loc.name, loc.country);
  };

  const faqItems = [
    {
      question: 'How accurate is My Weather forecast data?',
      answer: 'My Weather utilizes a multi-provider API load balancer combining Open-Meteo, OpenWeatherMap, WeatherAPI, and NWS to deliver hyper-local, real-time predictions with 99% uptime.',
    },
    {
      question: 'What is the Air Quality Index (AQI)?',
      answer: 'AQI measures outdoor air pollution levels on a scale from 0 to 500 based on PM2.5, PM10, Ozone, NO2, CO, and SO2 concentration.',
    },
    {
      question: 'How does the Live Radar Doppler map update?',
      answer: 'The Doppler radar player connects to live RainViewer satellite tiles and updates every 10 minutes with animated past and forecast storm motion.',
    },
  ];

  return (
    <div className="space-y-8">
      <BreadcrumbSchema items={[{ name: 'Home Weather', url: 'https://myweather.ai.studio' }]} />
      <FaqSchema items={faqItems} />

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Live Weather Feed • {providerUsed}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Accurate Weather Forecast & Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time conditions, 10-day hourly forecast, Doppler radar storm maps & air quality for {locationName}
          </p>
        </div>

        {/* Search Control */}
        <div className="w-full lg:max-w-md">
          <WeatherSearch onSelectLocation={handleSelectLocation} />
        </div>
      </div>

      {/* Severe Weather Alert Banner if active */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-xs font-bold text-slate-500">Fetching live weather data for {locationName}...</span>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Main Weather Card */}
          <CurrentConditions
            weather={weather}
            providerUsed={providerUsed}
            unit={unit}
          />

          {/* Hourly Forecast */}
          <HourlyForecast hourly={weather.hourly} unit={unit} />

          {/* 10-Day Daily Forecast & Air Quality Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DailyForecast daily={weather.daily} unit={unit} />
            </div>

            <div className="space-y-6">
              {airQuality && <AirQualityCard aqiData={airQuality} />}
            </div>
          </div>

          {/* Live Radar Map */}
          <RadarMap lat={lat} lon={lon} locationName={locationName} />

          {/* Community Reviews & Ratings */}
          <CommentSection pageUrl="/" title={`Weather Accuracy Reviews for ${locationName}`} />
        </div>
      ) : null}
    </div>
  );
}
