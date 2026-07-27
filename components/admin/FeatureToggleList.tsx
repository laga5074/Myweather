'use client';

import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Sparkles, Shield, RefreshCw } from 'lucide-react';

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  scope: 'global' | 'pro' | 'admin';
}

export default function FeatureToggleList() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/features');
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags || []);
      }
    } catch (e) {
      console.error('Error fetching feature flags:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/admin/features');
        if (res.ok && !ignore) {
          const data = await res.json();
          setFlags(data.flags || []);
        }
      } catch (e) {
        console.error('Error fetching feature flags:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggle = async (flag: FeatureFlag) => {
    const updated = !flag.enabled;
    try {
      const res = await fetch('/api/admin/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...flag, enabled: updated }),
      });
      if (res.ok) fetchFlags();
    } catch (e) {
      console.error('Error toggling feature flag:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>Feature Flags & Pro Tier Toggles</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enable or disable platform features, beta radar projections, and Pro tier integrations
          </p>
        </div>

        <button
          onClick={fetchFlags}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-2">
        {flags.map((flag) => (
          <div key={flag.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{flag.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {flag.scope}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{flag.description}</p>
            </div>

            <button
              onClick={() => handleToggle(flag)}
              className={`p-1 rounded-xl transition-colors ${
                flag.enabled ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'
              }`}
            >
              {flag.enabled ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
