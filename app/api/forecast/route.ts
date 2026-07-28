import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherWithLoadBalancer } from '../../../lib/api/loadBalancer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat') || '51.5074';
  const lonStr = searchParams.get('lon') || '-0.1278';
  const name = searchParams.get('name') || 'London';
  const country = searchParams.get('country') || 'United Kingdom';

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  try {
    const { data } = await fetchWeatherWithLoadBalancer(lat, lon, name, country);
    return NextResponse.json({ weather: data });
  } catch (error: any) {
    console.error('Forecast API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch forecast' }, { status: 500 });
  }
}
