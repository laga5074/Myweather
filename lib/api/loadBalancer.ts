import { fetchOpenMeteoWeather, WeatherData } from './openMeteo';
import { fetchOpenWeatherMap } from './openWeatherMap';
import { fetchWeatherApiCom } from './weatherApiCom';
import { fetchTomorrowIo } from './tomorrowIo';
import { fetchVisualCrossing } from './visualCrossing';

export interface ApiKeyRecord {
  id: string;
  provider: 'openweathermap' | 'weatherapi' | 'tomorrowio' | 'visualcrossing' | 'openmeteo' | 'custom';
  label: string;
  key: string;
  dailyLimit: number;
  callsToday: number;
  resetAt: string;
  status: 'active' | 'disabled' | 'exhausted';
  priority: number; // Lower number = higher priority (e.g. 1 is tried before 2)
  createdAt: string;
  updatedAt: string;
}

// Memory pool of keys for fast load balancing
export const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: 'openmeteo-default',
    provider: 'openmeteo',
    label: 'Open-Meteo High-Res Engine (Unlimited Zero-Config)',
    key: 'open_meteo_builtin_key',
    dailyLimit: 1000000,
    callsToday: 0,
    resetAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'active',
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'owm-default',
    provider: 'openweathermap',
    label: 'OpenWeatherMap Key #1 (Primary)',
    key: process.env.OPENWEATHERMAP_API_KEY || '',
    dailyLimit: 1000,
    callsToday: 0,
    resetAt: new Date(Date.now() + 86400000).toISOString(),
    status: process.env.OPENWEATHERMAP_API_KEY ? 'active' : 'disabled',
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wapi-default',
    provider: 'weatherapi',
    label: 'WeatherAPI.com Free Tier #1',
    key: process.env.WEATHERAPI_KEY || '',
    dailyLimit: 33000,
    callsToday: 0,
    resetAt: new Date(Date.now() + 86400000).toISOString(),
    status: process.env.WEATHERAPI_KEY ? 'active' : 'disabled',
    priority: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tomorrow-default',
    provider: 'tomorrowio',
    label: 'Tomorrow.io AI Key #1',
    key: process.env.TOMORROW_IO_KEY || '',
    dailyLimit: 500,
    callsToday: 0,
    resetAt: new Date(Date.now() + 86400000).toISOString(),
    status: process.env.TOMORROW_IO_KEY ? 'active' : 'disabled',
    priority: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vc-default',
    provider: 'visualcrossing',
    label: 'Visual Crossing Key #1',
    key: process.env.VISUAL_CROSSING_KEY || '',
    dailyLimit: 1000,
    callsToday: 0,
    resetAt: new Date(Date.now() + 86400000).toISOString(),
    status: process.env.VISUAL_CROSSING_KEY ? 'active' : 'disabled',
    priority: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let inMemoryKeys: ApiKeyRecord[] = [...INITIAL_KEYS];

export function getApiKeyRecords(): ApiKeyRecord[] {
  return [...inMemoryKeys];
}

export function setApiKeyRecords(keys: ApiKeyRecord[]): void {
  inMemoryKeys = [...keys];
}

export function updateApiKeyRecord(updated: ApiKeyRecord): ApiKeyRecord {
  const index = inMemoryKeys.findIndex((k) => k.id === updated.id);
  if (index >= 0) {
    inMemoryKeys[index] = { ...updated, updatedAt: new Date().toISOString() };
    return inMemoryKeys[index];
  } else {
    inMemoryKeys.push(updated);
    return updated;
  }
}

export function deleteApiKeyRecord(id: string): void {
  inMemoryKeys = inMemoryKeys.filter((k) => k.id !== id);
}

export function checkIfAllApisDisabled(): boolean {
  if (inMemoryKeys.length > 0 && inMemoryKeys.every((k) => k.status === 'disabled')) {
    return true;
  }
  const activeKeys = inMemoryKeys.filter(
    (k) =>
      k.status === 'active' &&
      (k.provider === 'openmeteo' || (k.key && k.key.trim().length > 0)) &&
      k.callsToday < k.dailyLimit
  );
  return activeKeys.length === 0;
}

export async function fetchWeatherWithLoadBalancer(
  lat: number,
  lon: number,
  locationName: string = 'Current Location',
  countryName: string = ''
): Promise<{ data: WeatherData; providerUsed: string }> {
  // Check if all APIs are disabled by admin
  if (checkIfAllApisDisabled()) {
    throw new Error('All weather APIs are currently disabled by the admin. Please enable APIs in the Admin Dashboard to view data.');
  }

  // Reset key counters if 24 hours have passed since resetAt
  const now = new Date();
  inMemoryKeys.forEach((key) => {
    if (new Date(key.resetAt) <= now) {
      key.callsToday = 0;
      key.resetAt = new Date(Date.now() + 86400000).toISOString();
      if (key.status === 'exhausted') {
        key.status = 'active';
      }
    }
  });

  // Filter active keys with valid string & available daily limit
  const activeKeys = inMemoryKeys.filter(
    (k) =>
      k.status === 'active' &&
      (k.provider === 'openmeteo' || (k.key && k.key.trim().length > 0)) &&
      k.callsToday < k.dailyLimit
  );

  // Sort active keys by priority (lowest number first), then by lowest usage ratio for load balancing across keys with equal priority
  const sortedKeys = activeKeys.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const ratioA = a.callsToday / Math.max(1, a.dailyLimit);
    const ratioB = b.callsToday / Math.max(1, b.dailyLimit);
    return ratioA - ratioB;
  });

  for (const apiKeyRecord of sortedKeys) {
    try {
      if (apiKeyRecord.provider === 'openmeteo') {
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `Open-Meteo (${apiKeyRecord.label})` };
      } else if (apiKeyRecord.provider === 'openweathermap') {
        await fetchOpenWeatherMap(lat, lon, apiKeyRecord.key);
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `OpenWeatherMap (${apiKeyRecord.label})` };
      } else if (apiKeyRecord.provider === 'weatherapi') {
        await fetchWeatherApiCom(lat, lon, apiKeyRecord.key);
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `WeatherAPI.com (${apiKeyRecord.label})` };
      } else if (apiKeyRecord.provider === 'tomorrowio') {
        await fetchTomorrowIo(lat, lon, apiKeyRecord.key);
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `Tomorrow.io (${apiKeyRecord.label})` };
      } else if (apiKeyRecord.provider === 'visualcrossing') {
        await fetchVisualCrossing(lat, lon, apiKeyRecord.key);
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `Visual Crossing (${apiKeyRecord.label})` };
      } else if (apiKeyRecord.provider === 'custom') {
        apiKeyRecord.callsToday += 1;
        const fullData = await fetchOpenMeteoWeather(lat, lon, locationName, countryName);
        return { data: fullData, providerUsed: `Custom Provider (${apiKeyRecord.label})` };
      }
    } catch (err) {
      console.warn(`Provider ${apiKeyRecord.provider} (${apiKeyRecord.label}) failed:`, err);
      apiKeyRecord.callsToday += 1;
      if (apiKeyRecord.callsToday >= apiKeyRecord.dailyLimit) {
        apiKeyRecord.status = 'exhausted';
      }
      // Continue to next key in chain
    }
  }

  throw new Error('All weather APIs are currently disabled or exhausted by the admin. Please enable APIs in the Admin Dashboard.');
}
