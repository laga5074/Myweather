'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset, 
  Star, 
  Thermometer, 
  Compass, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { WeatherData } from '../../lib/api/openMeteo';
import { formatTemp, formatSpeed, getWeatherDescription, getWeatherIcon } from '../../lib/utils/units';
import { formatTime } from '../../lib/utils/formatDate';
import { auth, db } from '../../lib/firebase/client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface CurrentConditionsProps {
  weather: WeatherData;
  providerUsed?: string;
  unit?: 'metric' | 'imperial';
}

export default function CurrentConditions({ weather, providerUsed, unit = 'metric' }: CurrentConditionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { current, location, daily } = weather;
  const todayDaily = daily[0];

  useEffect(() => {
    const checkSaved = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const saved: any[] = snap.data().savedLocations || [];
          const exists = saved.some((s) => s.name.toLowerCase() === location.name.toLowerCase());
          setIsSaved(exists);
        }
      } catch (e) {
        console.error('Error checking saved location:', e);
      }
    };
    checkSaved();
  }, [location.name]);

  const toggleSaveLocation = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to save locations to your personal dashboard.');
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const saved: any[] = snap.data().savedLocations || [];
        let updated: any[];
        if (isSaved) {
          updated = saved.filter((s) => s.name.toLowerCase() !== location.name.toLowerCase());
          setIsSaved(false);
        } else {
          updated = [
            ...saved,
            { name: location.name, lat: location.latitude, lon: location.longitude, country: location.country }
          ];
          setIsSaved(true);
        }
        await updateDoc(userRef, { savedLocations: updated });
      }
    } catch (e) {
      console.error('Error updating saved location:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      
      {/* Background glow element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Header: Location Name, Country & Save Star */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {location.name}
            </h1>
            <button
              onClick={toggleSaveLocation}
              disabled={saving}
              id="save-location-star-button"
              className={`p-1.5 rounded-full transition-colors ${
                isSaved
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isSaved ? 'Saved to dashboard' : 'Save location'}
            >
              <Star className={`h-5 w-5 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
          {location.country && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {location.country} • {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </p>
          )}
        </div>

        {/* Load balancer provider tag */}
        {providerUsed && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{providerUsed}</span>
          </div>
        )}
      </div>

      {/* Main Temperature & Weather Info */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Sun className="h-10 w-10 animate-pulse" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                {formatTemp(current.temp, unit)}
              </span>
              <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
                Feels like {formatTemp(current.feelsLike, unit)}
              </span>
            </div>
            <p className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-1 capitalize">
              {getWeatherDescription(current.weatherCode)}
            </p>
          </div>
        </div>

        {/* Today High / Low */}
        {todayDaily && (
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today&apos;s Range</span>
            <div className="flex items-center gap-3 font-bold text-sm">
              <span className="text-rose-500">High {formatTemp(todayDaily.tempMax, unit)}</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-blue-500">Low {formatTemp(todayDaily.tempMin, unit)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of 6 Key Weather Metrics */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Wind */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Wind className="h-4 w-4 text-blue-500" />
            <span>Wind</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {formatSpeed(current.windSpeed, unit)}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Gusts {formatSpeed(current.windGusts, unit)}
          </span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Droplets className="h-4 w-4 text-cyan-500" />
            <span>Humidity</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {current.humidity}%
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Dew Pt: {formatTemp(current.dewPoint, unit)}
          </span>
        </div>

        {/* Pressure */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Gauge className="h-4 w-4 text-indigo-500" />
            <span>Pressure</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {current.pressure} hPa
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {current.pressure > 1013 ? 'High pressure' : 'Low pressure'}
          </span>
        </div>

        {/* UV Index */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>UV Index</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {current.uvIndex} <span className="text-xs font-normal text-slate-400">/ 12</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {current.uvIndex <= 2 ? 'Low Risk' : current.uvIndex <= 5 ? 'Moderate' : 'High Risk'}
          </span>
        </div>

        {/* Visibility */}
        <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Eye className="h-4 w-4 text-emerald-500" />
            <span>Visibility</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
            {current.visibility.toFixed(1)} km
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {current.visibility >= 10 ? 'Clear visibility' : 'Reduced visibility'}
          </span>
        </div>

        {/* Sun Times */}
        {todayDaily && (
          <div className="flex flex-col justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Sunrise className="h-4 w-4 text-orange-500" />
              <span>Sun Times</span>
            </div>
            <div className="mt-2 space-y-0.5 text-xs font-bold text-slate-900 dark:text-white">
              <div className="flex items-center gap-1">
                <Sunrise className="h-3 w-3 text-amber-500" />
                <span>{formatTime(todayDaily.sunrise)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sunset className="h-3 w-3 text-purple-500" />
                <span>{formatTime(todayDaily.sunset)}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
