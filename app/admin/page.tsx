'use client';

import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AdminStatsCards from '../../components/admin/AdminStatsCards';
import ApiKeyManager from '../../components/admin/ApiKeyManager';
import CommentModerationQueue from '../../components/admin/CommentModerationQueue';
import FeatureToggleList from '../../components/admin/FeatureToggleList';
import UserTable from '../../components/admin/UserTable';
import { Shield, Key, MessageSquare, Sparkles, Users, Activity } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apikeys' | 'comments' | 'features' | 'users'>('overview');

  const tabs: Array<{ id: typeof activeTab; label: string; icon: any }> = [
    { id: 'overview', label: 'Overview & Stats', icon: Activity },
    { id: 'apikeys', label: 'API Key Load Balancer', icon: Key },
    { id: 'comments', label: 'Comment Queue', icon: MessageSquare },
    { id: 'features', label: 'Feature Flags', icon: Sparkles },
    { id: 'users', label: 'Users & Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Moderation Control Panel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Weather Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage weather provider keys, load balancer priorities, review moderation, and feature toggles
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AdminStatsCards />
              <ApiKeyManager />
            </div>
          )}

          {activeTab === 'apikeys' && <ApiKeyManager />}
          {activeTab === 'comments' && <CommentModerationQueue />}
          {activeTab === 'features' && <FeatureToggleList />}
          {activeTab === 'users' && <UserTable />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
