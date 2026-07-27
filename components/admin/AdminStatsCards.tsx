'use client';

import React from 'react';
import { Users, Key, MessageSquare, Activity, ShieldCheck, CloudRain } from 'lucide-react';

export default function AdminStatsCards() {
  const stats = [
    { label: 'Active Users', value: '1,280', icon: Users, change: '+12% this week', color: 'text-blue-500' },
    { label: 'API Keys Active', value: '4 Pool Keys', icon: Key, change: '100% operational', color: 'text-emerald-500' },
    { label: 'Comments Moderated', value: '342 Reviews', icon: MessageSquare, change: '98% auto-filtered', color: 'text-amber-500' },
    { label: 'System Uptime', value: '99.98%', icon: Activity, change: 'Open-Meteo & Radar live', color: 'text-cyan-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
              <Icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">{s.change}</span>
          </div>
        );
      })}
    </div>
  );
}
