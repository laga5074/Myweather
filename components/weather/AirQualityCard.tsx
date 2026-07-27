'use client';

import React from 'react';
import { Wind, ShieldAlert, HeartHandshake, Info } from 'lucide-react';
import { AirQualityData } from '../../lib/api/openMeteo';

interface AirQualityCardProps {
  aqiData: AirQualityData;
}

export function getAqiStatus(aqi: number) {
  if (aqi <= 50) {
    return {
      label: 'Good',
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-200 dark:border-emerald-800',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      desc: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: 'bg-amber-500 text-white',
      border: 'border-amber-200 dark:border-amber-800',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      textColor: 'text-amber-700 dark:text-amber-400',
      desc: 'Air quality is acceptable. Unusually sensitive individuals should limit prolonged outdoor exertion.',
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: 'bg-orange-500 text-white',
      border: 'border-orange-200 dark:border-orange-800',
      bgLight: 'bg-orange-50 dark:bg-orange-950/40',
      textColor: 'text-orange-700 dark:text-orange-400',
      desc: 'Members of sensitive groups may experience health effects. General public is less likely to be affected.',
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      color: 'bg-rose-500 text-white',
      border: 'border-rose-200 dark:border-rose-800',
      bgLight: 'bg-rose-50 dark:bg-rose-950/40',
      textColor: 'text-rose-700 dark:text-rose-400',
      desc: 'Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.',
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: 'bg-purple-600 text-white',
      border: 'border-purple-200 dark:border-purple-800',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40',
      textColor: 'text-purple-700 dark:text-purple-400',
      desc: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.',
    };
  }
  return {
    label: 'Hazardous',
    color: 'bg-red-800 text-white',
    border: 'border-red-300 dark:border-red-900',
    bgLight: 'bg-red-100 dark:bg-red-950/80',
    textColor: 'text-red-800 dark:text-red-300',
    desc: 'Health warnings of emergency conditions. The entire population is likely to be affected.',
  };
}

export default function AirQualityCard({ aqiData }: AirQualityCardProps) {
  const status = getAqiStatus(aqiData.aqi);
  const percent = Math.min(100, (aqiData.aqi / 300) * 100);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Wind className="h-5 w-5 text-blue-500" />
          <span>Air Quality Index (AQI)</span>
        </h3>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Main AQI Gauge */}
      <div className={`p-4 rounded-xl border ${status.border} ${status.bgLight} mb-6`}>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{aqiData.aqi}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-semibold">US AQI</span>
          </div>
          <p className={`text-xs font-bold ${status.textColor}`}>
            {status.label} Air
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${status.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed flex items-start gap-1.5">
          <HeartHandshake className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
          <span>{status.desc}</span>
        </p>
      </div>

      {/* Pollutant Breakdown Grid */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Key Pollutants
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">PM2.5</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.pm2_5} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">PM10</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.pm10} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">Ozone (O₃)</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.o3} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">NO₂</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.no2} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">CO</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.co} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-semibold block">SO₂</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {aqiData.so2} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </span>
        </div>
      </div>
    </div>
  );
}
