import { NextRequest, NextResponse } from 'next/server';
import { fetchAirQuality } from '../../../lib/api/openMeteo';
import { checkIfAllApisDisabled } from '../../../lib/api/loadBalancer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat') || '51.5074';
  const lonStr = searchParams.get('lon') || '-0.1278';

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  try {
    if (checkIfAllApisDisabled()) {
      throw new Error('All weather APIs are currently disabled by the admin. Please enable APIs in the Admin Dashboard to view data.');
    }
    const data = await fetchAirQuality(lat, lon);
    return NextResponse.json({ airQuality: data });
  } catch (error: any) {
    console.error('Air quality API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch air quality' }, { status: 500 });
  }
}
