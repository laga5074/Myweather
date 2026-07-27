'use client';

import React, { useState, useEffect } from 'react';
import WeatherSearch from '../../../components/weather/WeatherSearch';
import AirQualityCard from '../../../components/weather/AirQualityCard';
import PollenCountCard from '../../../components/weather/PollenCountCard';
import UVIndexCard from '../../../components/weather/UVIndexCard';
import CommentSection from '../../../components/comments/CommentSection';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { AirQualityData } from '../../../lib/api/openMeteo';
import { Wind, RefreshCw } from 'lucide-react';

export default function AirQualityPage() {
  const [lat, setLat] = useState<number>(51.5074);
  const [lon, setLon] = useState<number>(-0.1278);
  const [locationName, setLocationName] = useState<string>('London');
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAirQuality = async (l1: number, l2: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/air-quality?lat=${l1}&lon=${l2}`);
      if (res.ok) {
        const data = await res.json();
        setAirQuality(data.airQuality);
      }
    } catch (e) {
      console.error('Air quality load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setAirQuality(data.airQuality);
        }
      } catch (e) {
        console.error('Air quality load error:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [lat, lon]);

  return (
    <div className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: 'Air Quality & Pollen Index', url: 'https://myweather.ai.studio/air-quality' },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wind className="h-7 w-7 text-blue-500" />
            <span>Air Quality Index (AQI) & Pollen Report</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time PM2.5, PM10, Ozone, UV exposure, and grass/tree pollen counts for {locationName}
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <WeatherSearch
            onSelectLocation={(loc) => {
              setLat(loc.lat);
              setLon(loc.lon);
              setLocationName(loc.name);
              loadAirQuality(loc.lat, loc.lon);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading air quality & pollen report...</span>
        </div>
      ) : airQuality ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AirQualityCard aqiData={airQuality} />
              <PollenCountCard pollen={airQuality.pollen} />
            </div>

            <div>
              <UVIndexCard uvIndex={airQuality.uvIndex} />
            </div>
          </div>

          <CommentSection pageUrl="/air-quality" title={`Air Quality & Asthma Discussion for ${locationName}`} />
        </div>
      ) : null}
    </div>
  );
}
