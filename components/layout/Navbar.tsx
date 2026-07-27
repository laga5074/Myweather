'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, 
  CloudRain, 
  MapPin, 
  Wind, 
  Layers, 
  User, 
  ShieldAlert, 
  Menu, 
  X,
  Compass,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { onAuthStateChanged, logoutUser, UserProfile, syncUserProfile } from '../../lib/firebase/auth';
import { auth } from '../../lib/firebase/client';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('mw_unit') as 'metric' | 'imperial') || 'metric';
    }
    return 'metric';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
        } catch (e) {
          console.error('Error syncing profile:', e);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    localStorage.setItem('mw_unit', newUnit);
    window.dispatchEvent(new CustomEvent('mw_unit_change', { detail: newUnit }));
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Sun },
    { href: '/forecast', label: '10-Day Forecast', icon: CloudRain },
    { href: '/radar', label: 'Live Radar', icon: Layers },
    { href: '/air-quality', label: 'Air Quality', icon: Wind },
    { href: '/integrations', label: 'Data Sources', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <CloudRain className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              My Weather
              <span className="rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
                Live
              </span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              myweather.ai.studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Unit Switcher */}
          <button
            onClick={toggleUnit}
            id="unit-toggle-button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Toggle Temperature Unit"
          >
            <span className={unit === 'metric' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className={unit === 'imperial' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}>°F</span>
          </button>

          {/* User Auth state */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                id="user-dashboard-link"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Dashboard
              </Link>

              {userProfile.role === 'admin' && (
                <Link
                  href="/admin"
                  id="admin-dashboard-link"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}

              <button
                onClick={() => logoutUser()}
                id="logout-button"
                className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                id="login-link"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                id="signup-link"
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-button"
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Icon className="h-4 w-4 text-blue-500" />
                {link.label}
              </Link>
            );
          })}
          {userProfile && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <MapPin className="h-4 w-4 text-blue-500" />
              My Saved Dashboard
            </Link>
          )}
          {userProfile?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Command Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
