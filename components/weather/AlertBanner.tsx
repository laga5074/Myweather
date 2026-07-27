'use client';

import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, X, ShieldAlert } from 'lucide-react';
import { NWSAlert } from '../../lib/api/nws';

export default function AlertBanner({ alerts }: { alerts: NWSAlert[] }) {
  const [selectedAlert, setSelectedAlert] = useState<NWSAlert | null>(null);

  if (!alerts || alerts.length === 0) return null;

  const topAlert = alerts[0];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Extreme':
      case 'Severe':
        return 'bg-rose-600 text-white border-rose-700';
      case 'Moderate':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-blue-600 text-white border-blue-700';
    }
  };

  return (
    <>
      <div className={`w-full rounded-2xl p-4 shadow-sm border ${getSeverityStyle(topAlert.severity)} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 transition-all`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold uppercase text-xs tracking-wider px-2 py-0.5 rounded bg-black/20">
                {topAlert.severity} Warning
              </span>
              <span className="text-xs font-medium opacity-90">{topAlert.event}</span>
            </div>
            <p className="text-sm font-bold mt-0.5 line-clamp-1">{topAlert.headline}</p>
          </div>
        </div>

        <button
          onClick={() => setSelectedAlert(topAlert)}
          id="view-alert-details-button"
          className="flex items-center gap-1 rounded-xl bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold shadow-sm transition-colors self-end sm:self-auto shrink-0"
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {selectedAlert.event} Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedAlert.headline}</p>
              
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p><strong>Urgency:</strong> {selectedAlert.urgency}</p>
                <p><strong>Affected Areas:</strong> {selectedAlert.areas}</p>
              </div>

              {selectedAlert.description && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Description</h4>
                  <p className="whitespace-pre-line leading-relaxed text-slate-500 dark:text-slate-400">
                    {selectedAlert.description}
                  </p>
                </div>
              )}

              {selectedAlert.instruction && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300">
                  <h4 className="font-bold mb-1">Recommended Actions</h4>
                  <p className="whitespace-pre-line leading-relaxed">{selectedAlert.instruction}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                Close Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
