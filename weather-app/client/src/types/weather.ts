export interface WeatherData {
  location: {
    name: string;
    country: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    visibility?: number;
    condition?: {
      text: string;
      icon?: string;
      code?: number;
    };

    temp_c?: number;
    temp_f?: number;
    feelslike_c?: number;
    feelslike_f?: number;
    wind_kph?: number;
    wind_mph?: number;
    pressure_mb?: number;
    vis_km?: number;
  };
  sun?: {
    sunrise: string;
    sunset: string;
  };
  timestamp: string;
}

export interface ForecastDayLegacy {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    avghumidity: number;
    maxwind_kph: number;
    maxwind_mph: number;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    temp_f: number;
    condition: { text: string; icon: string };
    humidity: number;
    wind_kph: number;
  }>;
}

export interface ForecastDayModern {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  cloudiness: number;
  chanceOfRain: number;
  windSpeed: number;
}

export interface ForecastData {
  location: {
    name: string;
    country: string;
    coordinates: { lat: number; lon: number };
  };
  forecast: {
    forecastday: ForecastDayLegacy[];
  };
  forecastModern: ForecastDayModern[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  meta: {
    requestId: string;
    responseTime: number;
  };
}

export type Units = 'metric' | 'imperial';