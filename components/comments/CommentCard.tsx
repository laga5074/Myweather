'use client';

import React from 'react';
import RatingStars from './RatingStars';
import SpamBadge from './SpamBadge';
import { CommentItem } from '../../lib/comments/moderation';
import { relativeTimeString } from '../../lib/utils/formatDate';
import { User } from 'lucide-react';

export default function CommentCard({ comment }: { comment: CommentItem }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {comment.userPhotoURL ? (
            <img
              src={comment.userPhotoURL}
              alt={comment.userName}
              className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
              {comment.userName?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </div>
          )}

          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              {comment.userName}
            </span>
            <p className="text-[11px] text-slate-400">{relativeTimeString(comment.createdAt)}</p>
          </div>
        </div>

        <RatingStars rating={comment.rating} size="sm" />
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
        {comment.text}
      </p>

      {comment.adminNote && (
        <div className="mt-2.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
          <strong>Moderator note:</strong> {comment.adminNote}
        </div>
      )}
    </div>
  );
}
