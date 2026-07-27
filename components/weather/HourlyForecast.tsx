'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, CloudRain, Droplets, Clock } from 'lucide-react';
import { WeatherData } from '../../lib/api/openMeteo';
import { formatTemp, getWeatherDescription } from '../../lib/utils/units';
import { formatTime } from '../../lib/utils/formatDate';

interface HourlyForecastProps {
  hourly: WeatherData['hourly'];
  unit?: 'metric' | 'imperial';
}

export default function HourlyForecast({ hourly, unit = 'metric' }: HourlyForecastProps) {
  const [activeTab, setActiveTab] = useState<'temp' | 'pop'>('temp');

  const chartData = hourly.slice(0, 24).map((item) => ({
    time: formatTime(item.time),
    temp: unit === 'imperial' ? Math.round((item.temp * 9) / 5 + 32) : Math.round(item.temp),
    pop: item.pop,
    rain: item.precipitation,
  }));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>48-Hour Hourly Forecast</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hourly temperature trends, precipitation probability, and wind metrics
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('temp')}
            id="hourly-temp-toggle"
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'temp'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab('pop')}
            id="hourly-pop-toggle"
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'pop'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Precipitation %
          </button>
        </div>
      </div>

      {/* Interactive Recharts Graph */}
      <div className="h-44 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {activeTab === 'temp' ? (
              <Area
                type="monotone"
                dataKey="temp"
                name={`Temperature (${unit === 'imperial' ? '°F' : '°C'})`}
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="pop"
                name="Rain Chance %"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#popGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Hourly Cards Slider */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {hourly.slice(0, 36).map((item, idx) => (
          <div
            key={item.time + idx}
            className="flex flex-col items-center justify-between min-w-[76px] rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {idx === 0 ? 'Now' : formatTime(item.time)}
            </span>

            <div className="my-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sun className="h-4 w-4" />
            </div>

            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatTemp(item.temp, unit)}
            </span>

            <div className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
              <Droplets className="h-3 w-3" />
              <span>{item.pop}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
