'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import BreadcrumbSchema from '../seo/BreadcrumbSchema';

export interface BreadcrumbCrumb {
  name: string;
  href: string;
}

export default function Breadcrumbs({ items = [] }: { items?: BreadcrumbCrumb[] }) {
  const fullItems = [{ name: 'Home', href: '/' }, ...items];

  return (
    <>
      <BreadcrumbSchema items={fullItems.map((i) => ({ name: i.name, url: i.href }))} />
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {fullItems.map((crumb, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                {isLast ? (
                  <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="h-3.5 w-3.5" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
