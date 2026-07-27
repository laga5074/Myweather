export async function fetchTomorrowIo(lat: number, lon: number, apiKey: string) {
  const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tomorrow.io error: ${res.status}`);
  return await res.json();
}
