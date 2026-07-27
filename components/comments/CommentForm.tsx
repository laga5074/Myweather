'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, Send, X, AlertCircle, CheckCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import { auth } from '../../lib/firebase/client';
import { detectSpam } from '../../lib/comments/spamDetector';

interface CommentFormProps {
  pageUrl: string;
  onSubmitted?: () => void;
  onClose?: () => void;
}

export default function CommentForm({ pageUrl, onSubmitted, onClose }: CommentFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const user = auth.currentUser;
    if (!user) {
      setError('You must be signed in to post a review.');
      return;
    }

    if (!text.trim() || text.length < 5) {
      setError('Please write at least 5 characters in your review.');
      return;
    }

    setSubmitting(true);
    try {
      const spamCheck = detectSpam(text);
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'User',
          userPhotoURL: user.photoURL || '',
          pageUrl,
          rating,
          text: text.trim(),
          status: spamCheck.isSpam ? 'spam' : 'pending',
          hasLinks: spamCheck.hasLinks,
          detectedLinks: spamCheck.detectedLinks,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to post comment');
      }

      setSuccess(
        spamCheck.isSpam
          ? 'Your review was submitted and flagged for moderator review due to links/spam rules.'
          : 'Thank you! Your review has been submitted and is pending admin approval.'
      );
      setText('');
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(err.message || 'An error occurred while posting your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-blue-500" />
          <span>Write a Weather Review</span>
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Rating
          </label>
          <RatingStars rating={rating} size="lg" interactive onRate={setRating} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Feedback / Review (max 500 characters)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            rows={4}
            id="comment-text-textarea"
            placeholder="Share your experience with forecast accuracy, radar speed, or local weather conditions..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-[11px] text-slate-400 mt-1">
            {text.length} / 500
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            id="submit-review-button"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
