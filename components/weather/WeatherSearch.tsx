'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Clock, X, Loader2 } from 'lucide-react';

export interface LocationOption {
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin1?: string;
}

interface WeatherSearchProps {
  onSelectLocation: (loc: LocationOption) => void;
  className?: string;
}

export default function WeatherSearch({ onSelectLocation, className = '' }: WeatherSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationOption[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mw_recent_searches');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
    return [];
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setOpen(true);
        }
      } catch (e) {
        console.error('Search fetch error:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationOption) => {
    onSelectLocation(loc);
    setQuery('');
    setOpen(false);

    // Save to recent
    const filtered = recentSearches.filter((r) => r.name !== loc.name);
    const updated = [loc, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('mw_recent_searches', JSON.stringify(updated));
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            // Reverse geocode via Open-Meteo or fallback
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1`);
            let locName = 'My Location';
            let country = '';
            if (res.ok) {
              const data = await res.json();
              if (data.results?.[0]) {
                locName = data.results[0].name;
                country = data.results[0].country || '';
              }
            }
            handleSelect({ name: locName, lat, lon, country });
          } catch (e) {
            handleSelect({ name: 'My Current Location', lat, lon, country: '' });
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to retrieve your location. Please check browser permissions.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search city, postal code, or airport..."
          id="weather-search-input"
          className="w-full rounded-xl border border-slate-200 bg-white/95 dark:border-slate-700/80 dark:bg-slate-800/90 py-2.5 pl-10 pr-20 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleCurrentLocation}
            disabled={loading}
            id="geolocation-search-button"
            className="flex items-center gap-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-400 px-2.5 py-1 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/60 transition-colors"
            title="Use current location"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
          {loading && (
            <div className="flex items-center justify-center p-4 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-500" />
              Searching cities worldwide...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-60 overflow-y-auto">
              {results.map((loc, idx) => (
                <button
                  key={`${loc.name}-${loc.lat}-${idx}`}
                  onClick={() => handleSelect(loc)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{loc.name}</span>
                      {loc.admin1 && <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">, {loc.admin1}</span>}
                      {loc.country && <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({loc.country})</span>}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching locations found for &quot;{query}&quot;.
            </div>
          )}

          {!query && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 px-1">
                <Clock className="h-3 w-3" />
                <span>Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((r, i) => (
                  <button
                    key={`${r.name}-${i}`}
                    onClick={() => handleSelect(r)}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <MapPin className="h-3 w-3 text-blue-500" />
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
