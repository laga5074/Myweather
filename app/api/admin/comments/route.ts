import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

let mockAdminComments: any[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'Sarah Jenkins',
    pageUrl: '/',
    rating: 5,
    text: 'My Weather forecast accuracy is incredible! Saved me during my morning jog in London.',
    status: 'approved',
    hasLinks: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c_pending1',
    userId: 'u8',
    userName: 'Mark Stevenson',
    pageUrl: '/forecast',
    rating: 4,
    text: '10-day forecast worked great for planning my trip to Tokyo.',
    status: 'pending',
    hasLinks: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c_spam1',
    userId: 'u9',
    userName: 'Crypto Bot',
    pageUrl: '/',
    rating: 1,
    text: 'Check out cheap weather sensors at http://spam-crypto.xyz',
    status: 'spam',
    hasLinks: true,
    detectedLinks: ['http://spam-crypto.xyz'],
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'pending';

  try {
    if (adminDb) {
      let query: any = adminDb.collection('comments');
      if (filter !== 'all') {
        query = query.where('status', '==', filter);
      }
      const snap = await query.get();
      const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ comments: list });
    }
  } catch (_e) {
    // Silent fallback
  }

  const list = mockAdminComments.filter((c) => (filter === 'all' ? true : c.status === filter));
  return NextResponse.json({ comments: list });
}

export async function PUT(req: NextRequest) {
  try {
    const { commentId, status, adminNote } = await req.json();

    try {
      if (adminDb) {
        await adminDb.collection('comments').doc(commentId).update({
          status,
          adminNote: adminNote || '',
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (_e) {
      // Silent fallback
    }

    const item = mockAdminComments.find((c) => c.id === commentId);
    if (item) {
      item.status = status;
      if (adminNote) item.adminNote = adminNote;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
