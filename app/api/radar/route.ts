import { NextRequest, NextResponse } from 'next/server';
import { fetchRainViewerRadar } from '../../../lib/api/rainviewer';

export async function GET() {
  try {
    const radarData = await fetchRainViewerRadar();
    return NextResponse.json(radarData);
  } catch (error: any) {
    console.error('Radar API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch radar' }, { status: 500 });
  }
}
