import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';

let mockFlags = [
  {
    id: 'f1',
    name: 'Multi-Provider Load Balancer',
    enabled: true,
    description: 'Auto-fallbacks across OpenWeatherMap, WeatherAPI, and Open-Meteo.',
    scope: 'global',
  },
  {
    id: 'f2',
    name: 'Live RainViewer Radar Overlay',
    enabled: true,
    description: 'Interactive animated precipitation Doppler radar player.',
    scope: 'global',
  },
  {
    id: 'f3',
    name: 'Pro Tier Custom API Keys',
    enabled: true,
    description: 'Allows Pro users to supply their own API keys for higher rate limits.',
    scope: 'pro',
  },
  {
    id: 'f4',
    name: 'Auto Spam Review Engine',
    enabled: true,
    description: 'Auto-flags reviews containing links or forbidden spam keywords.',
    scope: 'admin',
  },
];

export async function GET() {
  try {
    if (adminDb) {
      const snap = await adminDb.collection('feature_flags').get();
      if (!snap.empty) {
        const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ flags: list });
      }
    }
  } catch (_e) {
    // Silent fallback
  }

  return NextResponse.json({ flags: mockFlags });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    try {
      if (adminDb) {
        await adminDb.collection('feature_flags').doc(body.id).set(body, { merge: true });
      }
    } catch (_e) {
      // Silent fallback
    }

    const idx = mockFlags.findIndex((f) => f.id === body.id);
    if (idx !== -1) {
      mockFlags[idx] = { ...mockFlags[idx], ...body };
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
