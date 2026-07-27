'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  ShieldAlert,
  Wind,
  Thermometer,
  CloudLightning,
  Sun,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  VolumeX,
  Smartphone,
  Save,
  RefreshCw,
  Info
} from 'lucide-react';
import { db } from '../../lib/firebase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface LocationItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  quietHours: boolean;
  categories: {
    severeWarnings: boolean;
    highWindGale: boolean;
    extremeTemp: boolean;
    airQualityUv: boolean;
    dailyDigest: boolean;
  };
  locationSettings: Record<
    string,
    {
      enabled: boolean;
      severityThreshold: 'all' | 'extreme_only';
    }
  >;
}

interface NotificationSettingsProps {
  userId?: string | null;
  savedLocations: LocationItem[];
}

export default function NotificationSettings({
  userId,
  savedLocations,
}: NotificationSettingsProps) {
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [permissionSupported, setPermissionSupported] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [testSent, setTestSent] = useState<boolean>(false);
  const [simulatedAlerts, setSimulatedAlerts] = useState<Record<string, { title: string; severity: string }>>({});

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    enabled: true,
    soundEnabled: true,
    quietHours: false,
    categories: {
      severeWarnings: true,
      highWindGale: true,
      extremeTemp: true,
      airQualityUv: false,
      dailyDigest: true,
    },
    locationSettings: {},
  });

  // Check browser Notification permission on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserPermission(Notification.permission);
        setPermissionSupported(true);
      } else {
        setPermissionSupported(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync saved locations into locationSettings
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrefs((prev) => {
        const updatedLocations = { ...prev.locationSettings };
        let changed = false;
        savedLocations.forEach((loc) => {
          if (!updatedLocations[loc.name]) {
            updatedLocations[loc.name] = {
              enabled: true,
              severityThreshold: 'all',
            };
            changed = true;
          }
        });
        return changed ? { ...prev, locationSettings: updatedLocations } : prev;
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [savedLocations]);

  // Load from Firestore if user is authenticated
  useEffect(() => {
    if (!userId) return;
    const uid = userId;
    let ignore = false;
    async function loadUserPrefs() {
      try {
        const userRef = doc(db, 'users', uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && !ignore) {
          const data = snap.data();
          if (data.notificationPreferences) {
            setPrefs((prev) => ({
              ...prev,
              ...data.notificationPreferences,
              locationSettings: {
                ...prev.locationSettings,
                ...(data.notificationPreferences.locationSettings || {}),
              },
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load user notification preferences:', err);
      }
    }
    loadUserPrefs();
    return () => {
      ignore = true;
    };
  }, [userId]);

  // Fetch quick live alert preview status for saved locations
  useEffect(() => {
    let ignore = false;
    async function fetchAlertPreviews() {
      const results: Record<string, { title: string; severity: string }> = {};
      for (const loc of savedLocations) {
        try {
          const res = await fetch(`/api/alerts?lat=${loc.lat}&lon=${loc.lon}`);
          if (res.ok) {
            const data = await res.json();
            if (data.alerts && data.alerts.length > 0) {
              results[loc.name] = {
                title: data.alerts[0].event || 'Severe Weather Alert',
                severity: data.alerts[0].severity || 'Severe',
              };
            }
          }
        } catch (e) {
          // ignore
        }
      }
      if (!ignore) {
        setSimulatedAlerts(results);
      }
    }
    if (savedLocations.length > 0) {
      fetchAlertPreviews();
    }
    return () => {
      ignore = true;
    };
  }, [savedLocations]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setBrowserPermission(result);
        if (result === 'granted') {
          triggerToast('Browser push permissions granted successfully!');
        } else if (result === 'denied') {
          triggerToast('Notifications blocked in browser settings.');
        }
      } catch (e) {
        console.error('Permission request failed:', e);
      }
    }
  };

  const sendTestNotification = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);

    const testTitle = '⚡ Severe Weather Alert: London';
    const testBody = 'High Wind & Flash Flood Warning active for London. Take precautions immediately.';

    if (permissionSupported && Notification.permission === 'granted') {
      try {
        new Notification(testTitle, {
          body: testBody,
          icon: '/favicon.ico',
        });
        triggerToast('Test push notification dispatched to browser!');
      } catch (e) {
        triggerToast('Test notification preview active.');
      }
    } else {
      triggerToast('Test push notification preview active below.');
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      if (userId) {
        const uid = userId;
        const userRef = doc(db, 'users', uid);
        await setDoc(
          userRef,
          {
            notificationPreferences: prefs,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        triggerToast('Notification preferences saved to cloud profile ✓');
      } else {
        localStorage.setItem('myweather_notification_prefs', JSON.stringify(prefs));
        triggerToast('Notification preferences saved locally ✓');
      }
    } catch (e) {
      console.error('Save error:', e);
      triggerToast('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleLocationNotification = (locName: string) => {
    setPrefs((prev) => {
      const currentLoc = prev.locationSettings[locName] || { enabled: true, severityThreshold: 'all' };
      return {
        ...prev,
        locationSettings: {
          ...prev.locationSettings,
          [locName]: {
            ...currentLoc,
            enabled: !currentLoc.enabled,
          },
        },
      };
    });
  };

  const setLocationThreshold = (locName: string, threshold: 'all' | 'extreme_only') => {
    setPrefs((prev) => {
      const currentLoc = prev.locationSettings[locName] || { enabled: true, severityThreshold: 'all' };
      return {
        ...prev,
        locationSettings: {
          ...prev.locationSettings,
          [locName]: {
            ...currentLoc,
            severityThreshold: threshold,
          },
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <Bell className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Severe Weather Push Notification Center</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Receive instant real-time browser & mobile alerts whenever severe thunderstorms, high winds, flash floods, or temperature drops threaten your saved cities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={sendTestNotification}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            <Send className="h-3.5 w-3.5 text-blue-400" />
            <span>Test Push Alert</span>
          </button>

          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Simulated / Real Test Push Banner */}
      {testSent && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-md flex items-start gap-3 animate-fade-in">
          <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-extrabold text-sm flex items-center justify-between">
              <span>⚡ Sample Push Notification Dispatched</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                Live Preview
              </span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 font-medium">
              <strong>Severe Thunderstorm & High Wind Warning</strong> issued for London, UK. Winds up to 55mph detected. Seek indoor shelter.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Master Controls & Browser Permission Status */}
        <div className="space-y-6">
          
          {/* Browser Permission Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span>Browser Push Permission</span>
              </h3>
              
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  browserPermission === 'granted'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200'
                    : browserPermission === 'denied'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200'
                }`}
              >
                {permissionSupported ? browserPermission.toUpperCase() : 'NOT SUPPORTED'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browser push notifications allow instant alerts to pop up on your screen even when My Weather is minimized or in a background tab.
            </p>

            {browserPermission !== 'granted' && permissionSupported && (
              <button
                onClick={requestBrowserPermission}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span>Enable Browser Push Notifications</span>
              </button>
            )}

            {browserPermission === 'granted' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Browser notifications active & registered</span>
              </div>
            )}
          </div>

          {/* Master Toggles */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span>Global Alert Master Toggles</span>
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {/* Global Enable */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    All Push Notifications
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Master killswitch for all weather alerts
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.enabled}
                    onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Sound Enabled */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  {prefs.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-blue-500" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-400" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Alert Chime Sound
                    </span>
                    <span className="text-[10px] text-slate-400">Play audio chime on severe alerts</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.soundEnabled}
                    onChange={(e) => setPrefs({ ...prefs, soundEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Quiet Hours */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Quiet Hours (10 PM - 7 AM)
                  </span>
                  <span className="text-[10px] text-slate-400">Mute non-critical alerts overnight</span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.quietHours}
                    onChange={(e) => setPrefs({ ...prefs, quietHours: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Alert Category Toggles */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Severe Alert Categories</span>
            </h3>

            <div className="space-y-3">
              {/* Severe Warnings */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                    <CloudLightning className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      Severe Weather Warnings
                    </span>
                    <span className="text-[10px] text-slate-400">Tornado, Hurricane, Severe Storms</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.categories.severeWarnings}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        categories: { ...prefs.categories, severeWarnings: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* High Wind */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      High Wind & Gale Advisories
                    </span>
                    <span className="text-[10px] text-slate-400">Gusts over 40mph, gale force winds</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.categories.highWindGale}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        categories: { ...prefs.categories, highWindGale: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Extreme Temperature */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      Extreme Temp & Freeze
                    </span>
                    <span className="text-[10px] text-slate-400">Heatwaves, hard freeze alerts</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.categories.extremeTemp}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        categories: { ...prefs.categories, extremeTemp: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Air Quality & UV */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      Air Quality & UV Index
                    </span>
                    <span className="text-[10px] text-slate-400">AQI &gt; 150 (Unhealthy) or High UV</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.categories.airQualityUv}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        categories: { ...prefs.categories, airQualityUv: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Daily Briefing */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      Daily Morning Briefing (8 AM)
                    </span>
                    <span className="text-[10px] text-slate-400">Daily forecast summary push digest</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.categories.dailyDigest}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        categories: { ...prefs.categories, dailyDigest: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Per-Location Alert Controls */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Saved Location Notification Filters</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                {savedLocations.length} Cities
              </span>
            </div>

            {savedLocations.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <MapPin className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No saved locations found.</p>
                <p className="text-[10px] text-slate-400">
                  Add cities in your Saved Locations sidebar above to enable per-city weather push notifications.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedLocations.map((loc) => {
                  const locConfig = prefs.locationSettings[loc.name] || {
                    enabled: true,
                    severityThreshold: 'all',
                  };
                  const activeAlert = simulatedAlerts[loc.name];

                  return (
                    <div
                      key={loc.name}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{loc.country}</span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={locConfig.enabled}
                            onChange={() => toggleLocationNotification(loc.name)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {locConfig.enabled && (
                        <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              Alert Threshold:
                            </span>

                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <button
                                type="button"
                                onClick={() => setLocationThreshold(loc.name, 'all')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  locConfig.severityThreshold === 'all'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                              >
                                All Alerts
                              </button>
                              <button
                                type="button"
                                onClick={() => setLocationThreshold(loc.name, 'extreme_only')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  locConfig.severityThreshold === 'extreme_only'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                              >
                                Severe Only
                              </button>
                            </div>
                          </div>

                          {activeAlert && (
                            <div className="p-2 rounded-lg bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[10px] font-semibold flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span className="truncate">Active Alert: {activeAlert.title}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
