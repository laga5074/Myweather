'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Layers, Maximize2, RefreshCw, Eye } from 'lucide-react';
import { fetchRainViewerRadar, RadarMapData } from '../../lib/api/rainviewer';

interface RadarMapProps {
  lat: number;
  lon: number;
  locationName?: string;
  isFullPage?: boolean;
}

export default function RadarMap({ lat, lon, locationName = 'Live Area', isFullPage = false }: RadarMapProps) {
  const [radarData, setRadarData] = useState<RadarMapData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(6);
  const [colorScheme, setColorScheme] = useState<number>(2); // 2 = RainViewer smooth

  useEffect(() => {
    let mounted = true;
    const loadRadar = async () => {
      setLoading(true);
      try {
        const data = await fetchRainViewerRadar();
        if (mounted) {
          setRadarData(data);
          // Set to latest past radar frame
          const totalFrames = (data.past?.length || 0) + (data.nowcast?.length || 0);
          if (totalFrames > 0) {
            setCurrentIndex(Math.max(0, (data.past?.length || 1) - 1));
          }
        }
      } catch (e) {
        console.error('Radar loading error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRadar();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !radarData) return;

    const frames = [...(radarData.past || []), ...(radarData.nowcast || [])];
    if (frames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, 750);

    return () => clearInterval(interval);
  }, [isPlaying, radarData]);

  const frames = radarData ? [...(radarData.past || []), ...(radarData.nowcast || [])] : [];
  const currentFrame = frames[currentIndex];

  // Convert lat / lon to open street map tile x/y
  const tileX = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
  );

  const baseMapTileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

  const radarTileUrl =
    radarData && currentFrame
      ? `${radarData.host}${currentFrame.path}/256/${zoom}/${tileX}/${tileY}/${colorScheme}/1_1.png`
      : '';

  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 transition-colors ${isFullPage ? 'min-h-[600px]' : ''}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <span>Real-Time Radar & Precipitation Map</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live storm tracking for {locationName} • RainViewer Doppler feed
          </p>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 10))}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 3))}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Zoom Out"
          >
            -
          </button>

          {!isFullPage && (
            <a
              href="/radar"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full Screen</span>
            </a>
          )}
        </div>
      </div>

      {/* Radar Canvas Stage */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
            <span>Loading Doppler radar tiles...</span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Base Map Layer */}
            <img
              src={baseMapTileUrl}
              alt="Base Map"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-105"
            />

            {/* Radar Overlay Layer */}
            {radarTileUrl && (
              <img
                src={radarTileUrl}
                alt="Live Weather Radar Tile"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen transition-opacity duration-300"
              />
            )}

            {/* Location Pin overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
              <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-ping absolute" />
              <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-lg relative z-10" />
              <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-bold text-[10px] shadow-md border border-slate-700">
                {locationName}
              </span>
            </div>

            {/* Legend overlay */}
            <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[10px] text-slate-300 z-10">
              <span className="font-bold block mb-1">Precipitation Intensity</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Light</span>
                <div className="h-2 w-20 rounded bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 to-red-600" />
                <span className="text-slate-400">Heavy</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Controls */}
      {frames.length > 0 && currentFrame && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          
          {/* Play/Pause & Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              id="radar-play-pause-button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % frames.length)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Timeline Slider */}
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={currentIndex}
              onChange={(e) => {
                setCurrentIndex(Number(e.target.value));
                setIsPlaying(false);
              }}
              id="radar-timeline-slider"
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[70px] text-right font-mono">
              {new Date(currentFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
