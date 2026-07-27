import React from 'react';
import { Metadata } from 'next';
import BreadcrumbSchema from '../../../components/seo/BreadcrumbSchema';
import { FileText, CheckCircle, AlertTriangle, Scale, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use — My Weather',
  description: 'Review the legal Terms of Use and service agreements for using My Weather forecasting, live radar, and alert tools.',
};

export default function TermsOfUsePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://myweather.ai.studio' },
          { name: 'Terms of Use', url: 'https://myweather.ai.studio/terms' },
        ]}
      />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Scale className="h-3 w-3" />
            Legal Service Agreement
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        {/* Acceptance */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or using My Weather (<span className="font-semibold text-slate-900 dark:text-white">myweather.ai.studio</span>), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not access the application.
          </p>
        </div>

        {/* Use of Service */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>2. Description of Service & Permitted Use</span>
          </h2>
          <p>
            My Weather provides real-time weather observations, extended 10-day hourly predictions, interactive Doppler radar tiles, air quality reporting, and user alert customization.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal & Non-Commercial Use:</strong> The service is provided free of charge for personal weather tracking and educational awareness.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
            <li><strong>Prohibited Conduct:</strong> You agree not to attempt to scrape, reverse engineer, overload, or disrupt our API load balancer or server infrastructure.</li>
          </ul>
        </div>

        {/* Disclaimer of Warranties */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>3. Disclaimer regarding Severe Weather & Safety</span>
          </h2>
          <p>
            Meteorological forecasting involves inherent uncertainties. While My Weather aggregates high-accuracy data from leading meteorological providers (Open-Meteo, NWS, OpenWeatherMap, etc.), all data is provided strictly <span className="font-semibold text-slate-900 dark:text-white">&ldquo;AS IS&rdquo;</span> without warranties of absolute accuracy.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold">
            ⚠️ <strong>Safety Warning:</strong> Do not rely solely on My Weather for life-saving decisions during extreme weather events, hurricanes, tornadoes, or severe flash floods. Always consult official local government emergency management broadcasts and National Weather Service sirens in severe emergencies.
          </div>
        </div>

        {/* Community Moderation */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            <span>4. Community Contributions & Moderation</span>
          </h2>
          <p>
            Users may post weather observations, comments, and ratings. By submitting content, you grant My Weather a non-exclusive license to display your observation publicly. Our moderation system actively scans for spam, offensive language, or abusive content, and we reserve the right to remove any post or terminate accounts that violate our community standards.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <span>5. Modifications to Service & Terms</span>
          </h2>
          <p>
            We reserve the right to modify or discontinue any part of the service at any time without notice. Continued use of the platform following the posting of revised Terms of Use implies acceptance of the updated terms.
          </p>
        </div>

      </div>
    </div>
  );
}
