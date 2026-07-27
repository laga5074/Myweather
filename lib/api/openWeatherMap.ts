export async function fetchOpenWeatherMap(lat: number, lon: number, apiKey: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeatherMap error: ${res.status}`);
  return await res.json();
}
