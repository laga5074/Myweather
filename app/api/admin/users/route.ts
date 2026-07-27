import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

let mockUsers = [
  {
    uid: 'u1',
    email: 'xnoyzen@gmail.com',
    displayName: 'Lead Admin (xnoyzen)',
    role: 'admin',
    plan: 'pro',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'u2',
    email: 'sarah.j@example.com',
    displayName: 'Sarah Jenkins',
    role: 'user',
    plan: 'free',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'u3',
    email: 'pro.weather@example.com',
    displayName: 'David Miller',
    role: 'user',
    plan: 'pro',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    if (adminDb) {
      const snap = await adminDb.collection('users').get();
      if (!snap.empty) {
        const list = snap.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() }));
        return NextResponse.json({ users: list });
      }
    }
  } catch (_e) {
    // Silent fallback
  }

  return NextResponse.json({ users: mockUsers });
}

export async function PUT(req: NextRequest) {
  try {
    const { uid, role, plan } = await req.json();

    try {
      if (adminDb) {
        const updates: any = {};
        if (role) updates.role = role;
        if (plan) updates.plan = plan;
        await adminDb.collection('users').doc(uid).set(updates, { merge: true });
      }
    } catch (_e) {
      // Silent fallback
    }

    const idx = mockUsers.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      if (role) mockUsers[idx].role = role;
      if (plan) mockUsers[idx].plan = plan;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
