import React from 'react';
import { Metadata } from 'next';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { CloudRain, Sparkles, ShieldCheck, Zap, Globe, Layers, Cpu, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About My Weather — Multi-Provider Hyperlocal Forecasting',
  description: 'Discover the architecture behind My Weather: combining Open-Meteo, NWS, and live Doppler radar with zero latency and 99.9% uptime.',
};

export default function AboutPage() {
  const features = [
    {
      title: 'Multi-Provider Redundancy',
      desc: 'Our server-side load balancer dynamically routes requests between Open-Meteo, OpenWeatherMap, WeatherAPI, and Tomorrow.io to guarantee zero downtime even during regional API outages.',
      icon: Cpu,
      color: 'bg-blue-500',
    },
    {
      title: 'Live Doppler Radar Playback',
      desc: 'Integrated with RainViewer satellite tiles, providing high-resolution animated precipitation movement and 10-minute historical/forecast storm tracking.',
      icon: Layers,
      color: 'bg-indigo-500',
    },
    {
      title: 'Complete Air Quality & UV Suite',
      desc: 'Real-time monitoring of PM2.5, PM10, Ozone, NO2, Carbon Monoxide, and grass/tree pollen counts designed for asthma and allergy preparedness.',
      icon: Sparkles,
      color: 'bg-emerald-500',
    },
    {
      title: 'Offline-Friendly & Fast',
      desc: 'Built with Next.js App Router and Tailwind CSS for instant rendering, optimized image assets, and smooth mobile touch interactivity.',
      icon: Zap,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: 'About My Weather', url: 'https://myweather.ai.studio/about' },
        ]}
      />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
          <Globe className="h-3.5 w-3.5" />
          <span>Our Mission & Technology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Next-Generation Hyperlocal Weather Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          My Weather was built to solve the fragility of single-provider weather apps. By unifying the world&apos;s leading meteorological engines under one intelligent load balancer, we deliver instant, reliable forecasts for any coordinates on Earth.
        </p>
      </div>

      {/* Grid of Core Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className={`h-12 w-12 rounded-2xl ${feat.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Architecture Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl space-y-4 border border-blue-500/20">
        <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Reliability Guarantee</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Why Multi-Provider Redundancy Matters
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Traditional weather applications crash when their primary API provider experiences regional latency or maintenance. My Weather continually monitors API response times and health. If one engine lags or fails, requests are instantly failed over to backup meteorological satellites without missing a beat.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">Open-Meteo Engine</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">National Weather Service (NWS)</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">RainViewer Radar Tiles</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">OpenWeatherMap</span>
          <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">WeatherAPI.com</span>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
        <span>Crafted with</span>
        <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
        <span>for weather enthusiasts worldwide on Google AI Studio.</span>
      </div>
    </div>
  );
}
