export interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  pageUrl: string;
  rating: number; // 1 - 5
  text: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  hasLinks: boolean;
  detectedLinks?: string[];
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface AggregateRating {
  pageUrl: string;
  averageRating: number;
  totalReviews: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export function calculateAggregate(comments: CommentItem[]): AggregateRating {
  const approved = comments.filter((c) => c.status === 'approved');
  if (approved.length === 0) {
    return {
      pageUrl: '',
      averageRating: 5.0,
      totalReviews: 0,
      distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    };
  }

  const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  let sum = 0;

  approved.forEach((c) => {
    const key = String(Math.min(5, Math.max(1, Math.round(c.rating)))) as keyof typeof distribution;
    distribution[key] = (distribution[key] || 0) + 1;
    sum += c.rating;
  });

  return {
    pageUrl: approved[0]?.pageUrl || '',
    averageRating: Number((sum / approved.length).toFixed(1)),
    totalReviews: approved.length,
    distribution,
  };
}
