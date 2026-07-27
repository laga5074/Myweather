export async function fetchVisualCrossing(lat: number, lon: number, apiKey: string) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${apiKey}&contentType=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Visual Crossing error: ${res.status}`);
  return await res.json();
}
