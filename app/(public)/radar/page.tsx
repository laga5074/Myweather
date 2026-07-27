'use client';

import React, { useState } from 'react';
import RadarMap from '../../../components/weather/RadarMap';
import WeatherSearch from '../../../components/weather/WeatherSearch';
import CommentSection from '../../../components/comments/CommentSection';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { Layers } from 'lucide-react';

export default function RadarPage() {
  const [lat, setLat] = useState<number>(51.5074);
  const [lon, setLon] = useState<number>(-0.1278);
  const [locationName, setLocationName] = useState<string>('London');

  return (
    <div className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: 'Live Doppler Weather Radar', url: 'https://myweather.ai.studio/radar' },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-7 w-7 text-blue-500" />
            <span>Interactive Live Doppler Radar & Storm Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time animated precipitation satellite map with RainViewer playback timeline
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <WeatherSearch
            onSelectLocation={(loc) => {
              setLat(loc.lat);
              setLon(loc.lon);
              setLocationName(loc.name);
            }}
          />
        </div>
      </div>

      <RadarMap lat={lat} lon={lon} locationName={locationName} isFullPage />

      <CommentSection pageUrl="/radar" title="Radar Map Performance & Feedback" />
    </div>
  );
}
