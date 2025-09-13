// Weather API Response Types (OpenWeatherMap format)
export interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Forecast API Response Types
export interface ForecastApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Custom Response for Frontend
export interface WeatherData {
  location: {
    name: string;
    country: string;
    coordinates: {
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
    windDirection: number;
    visibility: number;
    cloudiness: number;
    condition: string;
    description: string;
    icon: string;
  };
  sun: {
    sunrise: string;
    sunset: string;
  };
  timestamp: string;
}

export interface ForecastData {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  forecast: Array<{
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
    windSpeed: number;
    cloudiness: number;
    chanceOfRain: number;
  }>;
}

export interface WeatherQuery {
  city?: string;
  lat?: number;
  lon?: number;
  units?: "metric" | "imperial" | "kelvin";
}

export interface ForecastQuery extends WeatherQuery {
  days?: number;
}

export interface WeatherError {
  code: string;
  message: string;
  details?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: WeatherError;
  timestamp: string;
  meta?: {
    requestId: string;
    responseTime: number;
    rateLimit?: {
      remaining: number;
      resetTime: string;
    };
  };
}
