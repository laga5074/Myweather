import { NextRequest, NextResponse } from 'next/server';
import { fetchNWSAlerts } from '../../../lib/api/nws';
import { checkIfAllApisDisabled } from '../../../lib/api/loadBalancer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat') || '40.7128';
  const lonStr = searchParams.get('lon') || '-74.006';

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  try {
    if (checkIfAllApisDisabled()) {
      throw new Error('All weather APIs are currently disabled by the admin.');
    }
    const alerts = await fetchNWSAlerts(lat, lon);
    return NextResponse.json({ alerts });
  } catch (error: any) {
    console.error('Alerts API error:', error);
    return NextResponse.json({ alerts: [] });
  }
}
