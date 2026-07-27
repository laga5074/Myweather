import { NextRequest, NextResponse } from 'next/server';
import { fetchAirQuality } from '../../../lib/api/openMeteo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat') || '51.5074';
  const lonStr = searchParams.get('lon') || '-0.1278';

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  try {
    const data = await fetchAirQuality(lat, lon);
    return NextResponse.json({ airQuality: data });
  } catch (error: any) {
    console.error('Air quality API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch air quality' }, { status: 500 });
  }
}
