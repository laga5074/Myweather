export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function msToKmh(ms: number): number {
  return Math.round(ms * 3.6);
}

export function hpaToInhg(hpa: number): number {
  return Number((hpa * 0.02953).toFixed(2));
}

export function formatTemp(tempC: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    return `${celsiusToFahrenheit(tempC)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatSpeed(speedKmh: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function getWeatherIcon(code: number, isDay: boolean = true): string {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return isDay ? 'sun' : 'moon';
  if (code === 1 || code === 2) return isDay ? 'cloud-sun' : 'cloud-moon';
  if (code === 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'cloud-fog';
  if (code >= 51 && code <= 55) return 'cloud-drizzle';
  if (code >= 61 && code <= 65) return 'cloud-rain';
  if (code >= 71 && code <= 77) return 'snowflake';
  if (code >= 80 && code <= 82) return 'cloud-rain-wind';
  if (code >= 85 && code <= 86) return 'cloud-snow';
  if (code >= 95) return 'cloud-lightning';
  if (code >= 96 && code <= 99) return 'cloud-hail';
  return 'sun';
}

export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return 'Clear sky';
    case 1: return 'Mainly clear';
    case 2: return 'Partly cloudy';
    case 3: return 'Overcast';
    case 45: return 'Fog';
    case 48: return 'Depositing rime fog';
    case 51: return 'Light drizzle';
    case 53: return 'Moderate drizzle';
    case 55: return 'Dense drizzle';
    case 61: return 'Slight rain';
    case 63: return 'Moderate rain';
    case 65: return 'Heavy rain';
    case 71: return 'Slight snow fall';
    case 73: return 'Moderate snow fall';
    case 75: return 'Heavy snow fall';
    case 80: return 'Slight rain showers';
    case 81: return 'Moderate rain showers';
    case 82: return 'Violent rain showers';
    case 95: return 'Thunderstorm';
    case 96: return 'Thunderstorm with slight hail';
    case 99: return 'Thunderstorm with heavy hail';
    default: return 'Fair weather';
  }
}
