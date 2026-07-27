'use client';

import React from 'react';
import { Flower2, Trees, Leaf, AlertCircle } from 'lucide-react';

interface PollenCountCardProps {
  pollen: {
    alder: number;
    birch: number;
    grass: number;
    ragweed: number;
    olive: number;
  };
}

export function getPollenLevel(val: number) {
  if (val <= 10) return { label: 'Low', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' };
  if (val <= 50) return { label: 'Moderate', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' };
  if (val <= 150) return { label: 'High', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' };
  return { label: 'Very High', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' };
}

export default function PollenCountCard({ pollen }: PollenCountCardProps) {
  const items = [
    { name: 'Grass Pollen', value: pollen.grass, icon: Leaf },
    { name: 'Birch Pollen', value: pollen.birch, icon: Trees },
    { name: 'Ragweed Pollen', value: pollen.ragweed, icon: Flower2 },
    { name: 'Alder Pollen', value: pollen.alder, icon: Trees },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Flower2 className="h-5 w-5 text-emerald-500" />
          <span>Pollen & Allergen Count</span>
        </h3>
        <span className="text-xs font-semibold text-slate-400">Grains/m³</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const lvl = getPollenLevel(item.value);
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Icon className="h-4 w-4 text-emerald-500" />
                <span>{item.name}</span>
              </div>

              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${lvl.color}`}>
                  {lvl.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
