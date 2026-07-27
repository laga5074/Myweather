export interface NWSAlert {
  id: string;
  event: string;
  headline: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  urgency: string;
  areas: string;
  effective: string;
  expires: string;
  description: string;
  instruction?: string;
}

export async function fetchNWSAlerts(lat: number, lon: number): Promise<NWSAlert[]> {
  try {
    const res = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
      headers: {
        'User-Agent': '(MyWeatherApp, contact@myweather.ai.studio)',
        Accept: 'application/geo+json',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const features = data.features || [];

    return features.map((f: any) => ({
      id: f.properties.id || String(Math.random()),
      event: f.properties.event || 'Weather Alert',
      headline: f.properties.headline || f.properties.event || 'Severe Weather Warning',
      severity: f.properties.severity || 'Moderate',
      urgency: f.properties.urgency || 'Immediate',
      areas: f.properties.areaDesc || 'Affected Area',
      effective: f.properties.effective || new Date().toISOString(),
      expires: f.properties.expires || new Date().toISOString(),
      description: f.properties.description || '',
      instruction: f.properties.instruction || undefined,
    }));
  } catch (error) {
    console.error('NWS alerts error:', error);
    return [];
  }
}
