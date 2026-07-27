import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '../../../lib/api/openMeteo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocations(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Geocode route error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
