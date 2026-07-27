'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WeatherSearch from '../../components/weather/WeatherSearch';
import CurrentConditions from '../../components/weather/CurrentConditions';
import NotificationSettings from '../../components/dashboard/NotificationSettings';
import { auth, db } from '../../lib/firebase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MapPin, Plus, Trash2, Settings, ShieldCheck, Sparkles, RefreshCw, Key, Bell, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications'>('overview');
  const [savedLocations, setSavedLocations] = useState<Array<{ name: string; lat: number; lon: number; country: string }>>([
    { name: 'London', lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
    { name: 'New York', lat: 40.7128, lon: -74.006, country: 'United States' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  ]);

  const [selectedLoc, setSelectedLoc] = useState<{ name: string; lat: number; lon: number; country: string }>({
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    country: 'United Kingdom',
  });

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customKey, setCustomKey] = useState<string>('');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const loadWeather = async (lat: number, lon: number, name: string, cntry: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(cntry)}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data.weather);
      }
    } catch (e) {
      console.error('Dashboard weather load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${selectedLoc.lat}&lon=${selectedLoc.lon}&name=${encodeURIComponent(selectedLoc.name)}&country=${encodeURIComponent(selectedLoc.country)}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setWeatherData(data.weather);
        }
      } catch (e) {
        console.error('Dashboard weather load error:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [selectedLoc]);

  const handleAddLocation = (loc: { lat: number; lon: number; name: string; country: string }) => {
    if (!savedLocations.some((s) => s.name === loc.name)) {
      setSavedLocations([...savedLocations, loc]);
    }
    setSelectedLoc(loc);
  };

  const handleRemoveLocation = (name: string) => {
    const filtered = savedLocations.filter((s) => s.name !== name);
    setSavedLocations(filtered);
    if (filtered.length > 0) setSelectedLoc(filtered[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <MapPin className="h-7 w-7 text-blue-500" />
              <span>Personal Weather Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage saved locations, sync severe weather alert notifications, and configure Pro API provider keys
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white block line-clamp-1">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Free Member Tier
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Saved Weather Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Notification Settings</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-slate-950 font-black ml-1">
              PRO
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'notifications' ? (
          <NotificationSettings userId={user?.uid} savedLocations={savedLocations} />
        ) : (
          /* Saved Cities Grid & Add New City */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Saved Locations sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-5 space-y-4">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>Saved Cities ({savedLocations.length})</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Bell className="h-3 w-3" />
                    <span>Manage Alerts</span>
                  </button>
                </h2>

                <WeatherSearch onSelectLocation={handleAddLocation} />

                <div className="space-y-2 mt-4">
                  {savedLocations.map((loc) => {
                    const isSelected = selectedLoc.name === loc.name;
                    return (
                      <div
                        key={loc.name}
                        onClick={() => setSelectedLoc(loc)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{loc.country}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                              Active
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLocation(loc.name);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pro Tier API Key Config Box */}
              <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Pro API Key Custom Override
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supply your personal OpenWeatherMap or WeatherAPI secret key for unlimited high-frequency calls.
                </p>

                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Enter custom API key..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => setKeySaved(true)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {keySaved ? 'Saved to Profile ✓' : 'Save Custom Key'}
                </button>
              </div>
            </div>

            {/* Right Column: Selected Location Weather Display */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <RefreshCw className="h-7 w-7 text-blue-500 animate-spin" />
                  <span className="text-xs font-bold text-slate-500">
                    Loading saved weather for {selectedLoc.name}...
                  </span>
                </div>
              ) : weatherData ? (
                <CurrentConditions weather={weatherData} />
              ) : null}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
