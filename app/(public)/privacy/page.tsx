import React from 'react';
import { Metadata } from 'next';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { Shield, Lock, Eye, Server, Cookie, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — My Weather',
  description: 'Learn how My Weather collects, uses, and safeguards your location data, API preferences, and personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: 'Privacy Policy', url: 'https://myweather.ai.studio/privacy' },
        ]}
      />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Data Protection & Privacy
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        {/* Intro */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" />
            <span>1. Our Commitment to Your Privacy</span>
          </h2>
          <p>
            At My Weather (hosted at <span className="font-semibold text-slate-900 dark:text-white">myweather.ai.studio</span>), we respect your personal data and are committed to maintaining maximum transparency regarding how your information is handled. This Privacy Policy outlines our practices for collecting, using, and safeguarding information when you use our hyperlocal forecasting services, live Doppler radar, and severe weather alert systems.
          </p>
        </div>

        {/* What We Collect */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            <span>2. Information We Collect</span>
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">A. Location Data</h3>
              <p className="mt-1">
                To provide real-time weather conditions and severe storm warnings, we process geographical coordinates (latitude and longitude) or city names that you search for or save in your dashboard. If you grant browser geolocation permissions, your coordinates are used solely to fetch local weather tiles and are not tracked across websites.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">B. Account & Authentication Information</h3>
              <p className="mt-1">
                When you sign up or log in via Google Firebase Authentication or email, we securely store your email address, display name, and user ID. This enables syncing of your saved cities, custom temperature units (°C/°F), and alert preferences across devices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">C. Community Comments & Feedback</h3>
              <p className="mt-1">
                Any community reports, weather ratings, or comments submitted on location forecast pages are stored in our secure Firestore database and displayed publicly to assist other community members.
              </p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <span>3. How We Use and Share Information</span>
          </h2>
          <p>
            We use your data strictly to operate and improve the My Weather platform:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Weather API Load Balancing:</strong> Location coordinates are anonymized and proxied through our server-side load balancer to third-party meteorological providers including Open-Meteo, OpenWeatherMap, WeatherAPI, Tomorrow.io, Visual Crossing, and the US National Weather Service (NWS).</li>
            <li><strong>Severe Alert Notifications:</strong> If enabled in your dashboard, we check local weather advisories to trigger timely visual and desktop notifications for severe storms, air quality alerts, and extreme temperature events.</li>
            <li><strong>No Data Selling:</strong> We never sell, rent, or trade your personal information or location history to advertisers or third-party data brokers.</li>
          </ul>
        </div>

        {/* Cookies & Storage */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="h-5 w-5 text-blue-500" />
            <span>4. Local Storage & Cookies</span>
          </h2>
          <p>
            We utilize browser <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code> to remember your preferred temperature unit (Metric or Imperial) and temporary UI states. Firebase Authentication uses encrypted session cookies/tokens to keep you logged in safely.
          </p>
        </div>

        {/* Your Rights */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>5. Your Rights & Deletion Requests</span>
          </h2>
          <p>
            You have full control over your personal data. You may delete saved locations or turn off alert notifications directly from your Personal Weather Dashboard at any time. If you wish to completely delete your account and all associated comments or records, please reach out to our team via the Contact Support page.
          </p>
        </div>

      </div>
    </div>
  );
}
