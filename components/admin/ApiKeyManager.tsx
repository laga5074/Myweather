'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Shield,
  RefreshCw,
  ExternalLink,
  Check,
  Eye,
  EyeOff,
  Edit2,
  X,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ApiKeyRecord } from '../../lib/api/loadBalancer';

const PROVIDER_INFO: Record<
  string,
  { name: string; defaultLimit: number; signupUrl: string; color: string }
> = {
  openmeteo: {
    name: 'Open-Meteo Engine',
    defaultLimit: 1000000,
    signupUrl: 'https://open-meteo.com',
    color: 'bg-emerald-500 text-white',
  },
  openweathermap: {
    name: 'OpenWeatherMap',
    defaultLimit: 1000,
    signupUrl: 'https://home.openweathermap.org/users/sign_up',
    color: 'bg-orange-500 text-white',
  },
  weatherapi: {
    name: 'WeatherAPI.com',
    defaultLimit: 33000,
    signupUrl: 'https://www.weatherapi.com/signup.aspx',
    color: 'bg-blue-500 text-white',
  },
  tomorrowio: {
    name: 'Tomorrow.io',
    defaultLimit: 500,
    signupUrl: 'https://app.tomorrow.io/signup',
    color: 'bg-indigo-500 text-white',
  },
  visualcrossing: {
    name: 'Visual Crossing',
    defaultLimit: 1000,
    signupUrl: 'https://www.visualcrossing.com/weather-api',
    color: 'bg-purple-500 text-white',
  },
  custom: {
    name: 'Custom Provider',
    defaultLimit: 5000,
    signupUrl: '#',
    color: 'bg-slate-600 text-white',
  },
};

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderTab, setSelectedProviderTab] = useState<string>('all');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyRecord | null>(null);
  const [showKeySecret, setShowKeySecret] = useState<Record<string, boolean>>({});

  // Form Fields
  const [formData, setFormData] = useState({
    provider: 'openweathermap' as ApiKeyRecord['provider'],
    label: '',
    key: '',
    dailyLimit: 1000,
    priority: 1,
    status: 'active' as ApiKeyRecord['status'],
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (e) {
      console.error('Failed to load API keys:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadKeys = async () => {
      try {
        const res = await fetch('/api/admin/api-keys');
        if (res.ok && !ignore) {
          const data = await res.json();
          setKeys(data.keys || []);
        }
      } catch (e) {
        console.error('Failed to load API keys:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadKeys();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAddModal = (provider?: ApiKeyRecord['provider']) => {
    const defaultProv = provider || 'openweathermap';
    const existingForProv = keys.filter((k) => k.provider === defaultProv);
    const count = existingForProv.length + 1;

    setEditingKey(null);
    setFormData({
      provider: defaultProv,
      label: `${PROVIDER_INFO[defaultProv]?.name || 'Weather'} Key #${count}`,
      key: defaultProv === 'openmeteo' ? 'open_meteo_builtin_key' : '',
      dailyLimit: PROVIDER_INFO[defaultProv]?.defaultLimit || 1000,
      priority: count,
      status: 'active',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (keyRecord: ApiKeyRecord) => {
    setEditingKey(keyRecord);
    setFormData({
      provider: keyRecord.provider,
      label: keyRecord.label,
      key: keyRecord.key,
      dailyLimit: keyRecord.dailyLimit,
      priority: keyRecord.priority,
      status: keyRecord.status,
    });
    setShowModal(true);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingKey) {
        // PUT update
        const res = await fetch('/api/admin/api-keys', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingKey,
            ...formData,
          }),
        });
        if (res.ok) {
          triggerToast('API Key updated successfully');
          setShowModal(false);
          fetchKeys();
        }
      } else {
        // POST create
        const res = await fetch('/api/admin/api-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          triggerToast('New API key added to load balancer pool');
          setShowModal(false);
          fetchKeys();
        }
      }
    } catch (e) {
      console.error('Error saving API key:', e);
      triggerToast('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (keyRecord: ApiKeyRecord) => {
    const newStatus = keyRecord.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...keyRecord, status: newStatus }),
      });
      if (res.ok) {
        triggerToast(`Key ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
        fetchKeys();
      }
    } catch (e) {
      console.error('Error toggling key status:', e);
    }
  };

  const handleDuplicate = async (keyRecord: ApiKeyRecord) => {
    try {
      const existingSameProv = keys.filter((k) => k.provider === keyRecord.provider);
      const duplicated = {
        provider: keyRecord.provider,
        label: `${keyRecord.label} (Copy ${existingSameProv.length + 1})`,
        key: keyRecord.key,
        dailyLimit: keyRecord.dailyLimit,
        priority: keyRecord.priority + 1,
        status: 'active' as const,
      };
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });
      if (res.ok) {
        triggerToast('Key duplicated for load balancing');
        fetchKeys();
      }
    } catch (e) {
      console.error('Error duplicating key:', e);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) return;
    try {
      const res = await fetch(`/api/admin/api-keys?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        triggerToast('API key removed from pool');
        fetchKeys();
      }
    } catch (e) {
      console.error('Error deleting key:', e);
    }
  };

  const toggleSecretVisibility = (id: string) => {
    setShowKeySecret((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredKeys = keys.filter((k) => {
    if (selectedProviderTab === 'all') return true;
    return k.provider === selectedProviderTab;
  });

  const activeCount = keys.filter((k) => k.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-900 text-white p-6 rounded-3xl border border-blue-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <Zap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">API Key Pool & Multi-Company Load Balancer</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Add multiple API keys per weather provider (OpenWeatherMap, WeatherAPI, Tomorrow.io, Visual Crossing, etc.).
            Traffic is automatically distributed across active keys based on priority routing and daily rate limits.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchKeys}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Add New API Key</span>
          </button>
        </div>
      </div>

      {/* Pool Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Pool Keys</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{keys.length}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Keys</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Load Balancing</span>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
            <Activity className="h-4 w-4" /> Priority + Usage Ratio
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Zero-Config Fallback</span>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-4 w-4" /> Open-Meteo Built-in
          </div>
        </div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedProviderTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedProviderTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All Providers ({keys.length})
        </button>

        {Object.entries(PROVIDER_INFO).map(([key, info]) => {
          const count = keys.filter((k) => k.provider === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedProviderTab(key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedProviderTab === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{info.name}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Key List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKeys.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <Key className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No API keys found for this provider category.
            </p>
            <button
              onClick={() => handleOpenAddModal(selectedProviderTab !== 'all' ? (selectedProviderTab as any) : 'openweathermap')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Key for {selectedProviderTab}
            </button>
          </div>
        ) : (
          filteredKeys.map((k) => {
            const info = PROVIDER_INFO[k.provider] || PROVIDER_INFO.custom;
            const ratio = k.callsToday / Math.max(1, k.dailyLimit);
            let healthColor = 'bg-emerald-500';
            let healthBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200';

            if (ratio >= 0.9) {
              healthColor = 'bg-rose-500';
              healthBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200';
            } else if (ratio >= 0.7) {
              healthColor = 'bg-amber-500';
              healthBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200';
            }

            const isMasked = !showKeySecret[k.id];
            const displayKey =
              k.provider === 'openmeteo'
                ? 'Built-in Unlimited API (Zero-Config)'
                : isMasked
                ? k.key
                  ? `••••••••••••${k.key.slice(-4)}`
                  : 'No key provided'
                : k.key;

            return (
              <div
                key={k.id}
                className={`rounded-2xl border ${
                  k.status === 'active'
                    ? 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
                } p-5 shadow-sm space-y-4 hover:shadow-md transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${info.color}`}>
                        {info.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        Priority #{k.priority}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {k.label}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${healthBadge}`}>
                    {k.status === 'active' ? (ratio >= 0.9 ? 'Exhausting' : 'Active') : k.status}
                  </span>
                </div>

                {/* Key Secret Field */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <span className="truncate max-w-[200px]">{displayKey}</span>

                  {k.provider !== 'openmeteo' && k.key && (
                    <button
                      onClick={() => toggleSecretVisibility(k.id)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                      title={isMasked ? 'Show Secret Key' : 'Hide Secret Key'}
                    >
                      {isMasked ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>

                {/* Usage Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Calls Today</span>
                    <span>
                      {k.callsToday.toLocaleString()} / {k.dailyLimit.toLocaleString()} (
                      {Math.round(ratio * 100)}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${healthColor}`}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  {info.signupUrl !== '#' ? (
                    <a
                      href={info.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Get More Keys</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Custom Provider</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(k)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        k.status === 'active'
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {k.status === 'active' ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(k)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                      title="Edit Key Configuration"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(k)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                      title="Duplicate Key for Load Balancing"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    {k.provider !== 'openmeteo' && (
                      <button
                        onClick={() => handleDelete(k.id, k.label)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold"
                        title="Delete Key"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {editingKey ? 'Edit API Key' : 'Add New API Key'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure load balancer weights, company labels, and credentials
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveKey} className="space-y-4">
              {/* Provider Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Weather Service / Provider Company
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => {
                    const newProv = e.target.value as ApiKeyRecord['provider'];
                    const info = PROVIDER_INFO[newProv];
                    setFormData({
                      ...formData,
                      provider: newProv,
                      dailyLimit: info ? info.defaultLimit : 1000,
                      label: `${info?.name || 'API'} Key #${keys.filter((k) => k.provider === newProv).length + 1}`,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="openweathermap">OpenWeatherMap</option>
                  <option value="weatherapi">WeatherAPI.com</option>
                  <option value="tomorrowio">Tomorrow.io</option>
                  <option value="visualcrossing">Visual Crossing</option>
                  <option value="openmeteo">Open-Meteo (Unlimited Engine)</option>
                  <option value="custom">Custom Weather API</option>
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Label / Name (e.g. Company Key #2)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenWeatherMap Secondary Account"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Secret API Key */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  API Key Secret String
                </label>
                <input
                  type="text"
                  required={formData.provider !== 'openmeteo'}
                  placeholder={
                    formData.provider === 'openmeteo'
                      ? 'No secret key needed for Open-Meteo'
                      : 'Paste API Key secret string here...'
                  }
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Daily Limit & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.dailyLimit}
                    onChange={(e) => setFormData({ ...formData, dailyLimit: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">1 = Highest Priority</span>
                </div>
              </div>

              {/* Status Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active (Include in Load Balancer)</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingKey ? 'Save Key Changes' : 'Add API Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
