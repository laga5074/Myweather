import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/admin';

// In-memory fallback if Firestore admin is unavailable
let inMemoryComments: any[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'Sarah Jenkins',
    pageUrl: '/',
    rating: 5,
    text: 'My Weather forecast accuracy is incredible! Saved me during my morning jog in London.',
    status: 'approved',
    hasLinks: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: 'David Miller',
    pageUrl: '/radar',
    rating: 5,
    text: 'The live Doppler rain radar is super smooth and updates seamlessly.',
    status: 'approved',
    hasLinks: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: 'Elena Rostova',
    pageUrl: '/air-quality',
    rating: 5,
    text: 'Loving the PM2.5 pollen breakdown for allergic asthma guidance.',
    status: 'approved',
    hasLinks: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get('pageUrl') || '/';

  try {
    if (adminDb) {
      const snap = await adminDb
        .collection('comments')
        .where('status', '==', 'approved')
        .get();

      const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ comments: list });
    }
  } catch (_e) {
    // Silent fallback to memory store
  }

  const approvedList = inMemoryComments.filter(
    (c) => c.status === 'approved' && (c.pageUrl === pageUrl || pageUrl === '/')
  );
  return NextResponse.json({ comments: approvedList });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const commentObj = {
      id: `c_${Date.now()}`,
      userId: body.userId,
      userName: body.userName || 'Anonymous',
      userPhotoURL: body.userPhotoURL || '',
      pageUrl: body.pageUrl || '/',
      rating: body.rating || 5,
      text: body.text,
      status: body.status || 'pending',
      hasLinks: Boolean(body.hasLinks),
      detectedLinks: body.detectedLinks || [],
      createdAt: new Date().toISOString(),
    };

    try {
      if (adminDb) {
        await adminDb.collection('comments').doc(commentObj.id).set(commentObj);
      } else {
        inMemoryComments.unshift(commentObj);
      }
    } catch (_e) {
      inMemoryComments.unshift(commentObj);
    }

    return NextResponse.json({ success: true, comment: commentObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit comment' }, { status: 500 });
  }
}
