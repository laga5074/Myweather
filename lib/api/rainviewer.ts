export interface RadarMapData {
  host: string;
  version: string;
  generated: number;
  past: Array<{ time: number; path: string }>;
  nowcast: Array<{ time: number; path: string }>;
}

export async function fetchRainViewerRadar(): Promise<RadarMapData> {
  const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`RainViewer maps API error: ${res.status}`);
  }
  return await res.json();
}

export function getRadarTileUrl(
  host: string,
  path: string,
  tileSize: number = 256,
  z: number = 6,
  x: number = 32,
  y: number = 21,
  colorScheme: number = 2,
  smooth: boolean = true
): string {
  return `${host}${path}/${tileSize}/${z}/${x}/${y}/${colorScheme}/${smooth ? 1 : 0}_1.png`;
}
