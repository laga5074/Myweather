import React from 'react';
import Link from 'next/link';
import { CloudRain, Github, Twitter, Heart, Shield, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm transition-colors mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <CloudRain className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">My Weather</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hyperlocal, live weather forecasting, real-time precipitation radar, and air quality index for cities worldwide. 100% free with multi-provider redundancy.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span>Domain: myweather.ai.studio</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Live Dashboard</Link></li>
              <li><Link href="/forecast" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">10-Day & Hourly Forecast</Link></li>
              <li><Link href="/radar" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Interactive Weather Radar</Link></li>
              <li><Link href="/air-quality" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Air Quality & Pollen Index</Link></li>
              <li><Link href="/integrations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Weather API Data Sources</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Account & Help</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Saved Locations</Link></li>
              <li><Link href="/settings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Preferences & Units</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About My Weather</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Use</Link></li>
              <li className="pt-2 text-[11px] text-slate-400">
                Data sources: Open-Meteo, OpenWeatherMap, RainViewer, NWS, WeatherAPI.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} My Weather (myweather.ai.studio). All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">Google AI Studio & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
