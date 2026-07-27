'use client';

import React, { useState, useEffect } from 'react';
import WeatherSearch from '../../../components/weather/WeatherSearch';
import DailyForecast from '../../../components/weather/DailyForecast';
import HourlyForecast from '../../../components/weather/HourlyForecast';
import CommentSection from '../../../components/comments/CommentSection';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { WeatherData } from '../../../lib/api/openMeteo';
import { Calendar, RefreshCw } from 'lucide-react';

export default function ForecastPage() {
  const [lat, setLat] = useState<number>(51.5074);
  const [lon, setLon] = useState<number>(-0.1278);
  const [locationName, setLocationName] = useState<string>('London');
  const [country, setCountry] = useState<string>('United Kingdom');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadForecast = async (l1: number, l2: number, name: string, cntry: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forecast?lat=${l1}&lon=${l2}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(cntry)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data.weather);
      }
    } catch (e) {
      console.error('Forecast page load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&name=${encodeURIComponent(locationName)}&country=${encodeURIComponent(country)}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setWeather(data.weather);
        }
      } catch (e) {
        console.error('Forecast page load error:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [lat, lon, locationName, country]);

  return (
    <div className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: '10-Day Extended Forecast', url: 'https://myweather.ai.studio/forecast' },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="h-7 w-7 text-blue-500" />
            <span>10-Day Extended & Hourly Weather Forecast</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Extended daily trends, temperature range bars, precipitation chances, solar metrics for {locationName}
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <WeatherSearch
            onSelectLocation={(loc) => {
              setLat(loc.lat);
              setLon(loc.lon);
              setLocationName(loc.name);
              setCountry(loc.country);
              loadForecast(loc.lat, loc.lon, loc.name, loc.country);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading extended forecast for {locationName}...</span>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          <HourlyForecast hourly={weather.hourly} unit={unit} />
          <DailyForecast daily={weather.daily} unit={unit} />
          <CommentSection pageUrl="/forecast" title={`Forecast Ratings & Discussions for ${locationName}`} />
        </div>
      ) : null}
    </div>
  );
}
