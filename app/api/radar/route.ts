import { NextRequest, NextResponse } from 'next/server';
import { fetchRainViewerRadar } from '../../../lib/api/rainviewer';
import { checkIfAllApisDisabled } from '../../../lib/api/loadBalancer';

export async function GET() {
  try {
    if (checkIfAllApisDisabled()) {
      throw new Error('All weather APIs are currently disabled by the admin. Please enable APIs in the Admin Dashboard to view data.');
    }
    const radarData = await fetchRainViewerRadar();
    return NextResponse.json(radarData);
  } catch (error: any) {
    console.error('Radar API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch radar' }, { status: 500 });
  }
}
