export async function fetchWeatherApiCom(lat: number, lon: number, apiKey: string) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=10&aqi=yes&alerts=yes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WeatherAPI error: ${res.status}`);
  return await res.json();
}
