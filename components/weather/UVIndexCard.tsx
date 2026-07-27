'use client';

import React from 'react';
import { Sun, Glasses, ShieldAlert } from 'lucide-react';

interface UVIndexCardProps {
  uvIndex: number;
}

export function getUvCategory(uv: number) {
  if (uv <= 2) {
    return {
      category: 'Low',
      color: 'bg-emerald-500 text-white',
      advice: 'Minimal sun protection required. Safe to enjoy outdoors.',
    };
  }
  if (uv <= 5) {
    return {
      category: 'Moderate',
      color: 'bg-amber-500 text-white',
      advice: 'Wear sunglasses and SPF 30+ sunscreen during peak midday hours.',
    };
  }
  if (uv <= 7) {
    return {
      category: 'High',
      color: 'bg-orange-500 text-white',
      advice: 'Seek shade during 10 AM – 4 PM. Wear a hat, sunglasses, and SPF 30+.',
    };
  }
  if (uv <= 10) {
    return {
      category: 'Very High',
      color: 'bg-rose-600 text-white',
      advice: 'Avoid direct midday sun. Reapply SPF 50+ sunscreen every 2 hours.',
    };
  }
  return {
    category: 'Extreme',
    color: 'bg-purple-700 text-white',
    advice: 'Extreme caution! Unprotected skin can burn in minutes. Stay indoors.',
  };
}

export default function UVIndexCard({ uvIndex }: UVIndexCardProps) {
  const info = getUvCategory(uvIndex);
  const percent = Math.min(100, (uvIndex / 12) * 100);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="h-5 w-5 text-amber-500" />
          <span>UV Protection Gauge</span>
        </h3>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${info.color}`}>
          {info.category}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{uvIndex}</span>
        <span className="text-xs font-semibold text-slate-400">Max Index: 12</span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-500 ${info.color}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Glasses className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        <span>{info.advice}</span>
      </div>
    </div>
  );
}
