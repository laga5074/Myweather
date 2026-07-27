'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Sun, Sunrise, Sunset, Wind } from 'lucide-react';
import { WeatherData } from '../../lib/api/openMeteo';
import { formatTemp, getWeatherDescription } from '../../lib/utils/units';
import { getDayName, formatDate, formatTime } from '../../lib/utils/formatDate';

interface DailyForecastProps {
  daily: WeatherData['daily'];
  unit?: 'metric' | 'imperial';
}

export default function DailyForecast({ daily, unit = 'metric' }: DailyForecastProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Calculate global min and max across all 10 days for proportional range bar rendering
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const minTemp = Math.min(...allMins);
  const maxTemp = Math.max(...allMaxs);
  const range = maxTemp - minTemp || 1;

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors">
      
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span>10-Day Extended Forecast</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Daily temperature extremes, precipitation likelihood, and solar details
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          const isExpanded = expandedDate === day.date;

          // Compute width percentages for range bar
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - minTemp) / range) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / range) * 100));

          return (
            <div key={day.date} className="py-3.5 first:pt-0 last:pb-0">
              <div
                onClick={() => toggleExpand(day.date)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2.5 rounded-xl transition-colors"
              >
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {isToday ? 'Today' : getDayName(day.date, false)}
                    </span>
                    <p className="text-xs text-slate-400">{formatDate(day.date)}</p>
                  </div>
                </div>

                {/* Condition Text */}
                <div className="min-w-[150px]">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">
                    {getWeatherDescription(day.weatherCode)}
                  </p>
                  {day.popMax > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                      <Droplets className="h-3 w-3" />
                      <span>{day.popMax}% rain</span>
                    </div>
                  )}
                </div>

                {/* Temperature Bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 min-w-[36px] text-right">
                    {formatTemp(day.tempMin, unit)}
                  </span>

                  <div className="relative flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-rose-500"
                      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white min-w-[36px]">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                </div>

                {/* Chevron expand */}
                <div className="text-slate-400 self-end sm:self-center">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              {/* Accordion detail pane */}
              {isExpanded && (
                <div className="mt-2 ml-2 sm:ml-12 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Sunrise</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                      {formatTime(day.sunrise)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">Sunset</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Sunset className="h-3.5 w-3.5 text-purple-500" />
                      {formatTime(day.sunset)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">UV Index Max</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {day.uvIndexMax} (High)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">Max Wind</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5 text-blue-500" />
                      {day.windSpeedMax} km/h
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
