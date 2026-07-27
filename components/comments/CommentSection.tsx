'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, PlusCircle, Sparkles } from 'lucide-react';
import RatingStars from './RatingStars';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import { CommentItem, calculateAggregate } from '../../lib/comments/moderation';

interface CommentSectionProps {
  pageUrl: string;
  title?: string;
}

export default function CommentSection({ pageUrl, title = 'Community Ratings & Reviews' }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?pageUrl=${encodeURIComponent(pageUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error('Failed to load comments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?pageUrl=${encodeURIComponent(pageUrl)}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (e) {
        console.error('Failed to load comments:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [pageUrl]);

  const aggregate = calculateAggregate(comments);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors mt-8">
      
      {/* Top Title & Aggregate Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>{title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified user reviews and forecast feedback for {pageUrl}
          </p>
        </div>

        {/* Rating Breakdown summary box */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {aggregate.averageRating}
            </span>
            <div className="mt-1">
              <RatingStars rating={aggregate.averageRating} size="sm" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
              {aggregate.totalReviews} {aggregate.totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            id="write-review-button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Review Form Modal/Drawer */}
      {showForm && (
        <div className="mt-6 mb-6">
          <CommentForm
            pageUrl={pageUrl}
            onSubmitted={() => {
              fetchComments();
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Comments List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading user reviews...</div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
            <Star className="h-8 w-8 text-amber-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No reviews yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Be the first user to submit a review for this page! Share forecast accuracy or local weather updates.
            </p>
          </div>
        ) : (
          comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}
