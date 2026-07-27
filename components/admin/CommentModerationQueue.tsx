'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, ShieldAlert, Edit, Trash2, RefreshCw } from 'lucide-react';
import RatingStars from '../comments/RatingStars';
import SpamBadge from '../comments/SpamBadge';
import { CommentItem } from '../../lib/comments/moderation';

export default function CommentModerationQueue() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [filter, setFilter] = useState<'pending' | 'spam' | 'approved' | 'rejected' | 'all'>('pending');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error('Error fetching admin comment queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/comments?filter=${filter}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (e) {
        console.error('Error fetching admin comment queue:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [filter]);

  const handleUpdateStatus = async (commentId: string, status: 'approved' | 'rejected' | 'spam') => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, status }),
      });
      if (res.ok) fetchQueue();
    } catch (e) {
      console.error('Error updating comment status:', e);
    }
  };

  const tabs: Array<{ id: typeof filter; label: string }> = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'spam', label: 'Spam Queue' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All Reviews' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>Comment & Rating Moderation Queue</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-spam detection, manual review, approval workflow, and rating distribution
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading moderation items...</div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No items in {filter} queue.
          </div>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.userName}
                  </span>
                  <span className="text-xs text-slate-400">• page: {item.pageUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={item.rating} size="sm" />
                  <SpamBadge status={item.status} />
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                &quot;{item.text}&quot;
              </p>

              {item.hasLinks && item.detectedLinks && item.detectedLinks.length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Detected URLs: {item.detectedLinks.join(', ')}</span>
                </div>
              )}

              {/* Moderation Controls */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleUpdateStatus(item.id, 'rejected')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(item.id, 'spam')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Mark Spam</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(item.id, 'approved')}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
