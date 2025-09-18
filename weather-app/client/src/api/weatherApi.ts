import type {
  WeatherData,
  ForecastData,
  ApiResponse,
} from "../types/weather";

class WeatherApi {
  private apiKey =
    import.meta.env.BACKEND_WEATHER_API_URL || "http://localhost:3000";
  private baseURL = this.apiKey + "/api/weather";

  private normalizeWeatherData(
    apiData: any,
    units: string = "metric"
  ): WeatherData {
    const normalizedData = {
      ...apiData,
      current: {
        ...apiData.current,
        // Map new API format to old format for compatibility
        temp_c:
          units === "metric"
            ? apiData.current.temperature
            : (apiData.current.temperature * 9) / 5 + 32,
        temp_f:
          units === "imperial"
            ? apiData.current.temperature
            : ((apiData.current.temperature - 32) * 5) / 9,
        feelslike_c:
          units === "metric"
            ? apiData.current.feelsLike
            : (apiData.current.feelsLike * 9) / 5 + 32,
        feelslike_f:
          units === "imperial"
            ? apiData.current.feelsLike
            : ((apiData.current.feelsLike - 32) * 5) / 9,
        wind_kph: apiData.current.windSpeed,
        wind_mph: apiData.current.windSpeed * 0.621371,
        pressure_mb: apiData.current.pressure,
        vis_km: apiData.current.visibility || 10,
        condition: apiData.current.condition || {
          text: "Unknown",
          icon: "",
          code: 0,
        },
      },
    };

    return normalizedData as WeatherData;
  }

  private normalizeForecastData(
    apiData: any,
    units: string = "metric"
  ): ForecastData {
    const normalizedForecastDays = apiData.forecast.map((day: any) => ({
      date: day.date,
      day: {
        maxtemp_c:
          units === "metric"
            ? day.temperature.max
            : ((day.temperature.max - 32) * 5) / 9,
        maxtemp_f:
          units === "imperial"
            ? day.temperature.max
            : (day.temperature.max * 9) / 5 + 32,
        mintemp_c:
          units === "metric"
            ? day.temperature.min
            : ((day.temperature.min - 32) * 5) / 9,
        mintemp_f:
          units === "imperial"
            ? day.temperature.min
            : (day.temperature.min * 9) / 5 + 32,
        condition: {
          text: day.condition || "Unknown",
          icon: day.icon || "",
          code: 0,
        },
        avghumidity: day.humidity ?? 0,
        maxwind_kph: units === "metric" ? day.windSpeed * 3.6 : day.windSpeed,
        maxwind_mph:
          units === "imperial" ? day.windSpeed * 2.23694 : day.windSpeed,
      },
      hour: [],
      temperature: day.temperature,
      description: day.description,
      cloudiness: day.cloudiness,
      chanceOfRain: day.chanceOfRain,
      windSpeed: day.windSpeed,
    }));

    const normalizedData: ForecastData = {
      location: apiData.location,
      forecast: {
        forecastday: normalizedForecastDays,
      },
      forecastModern: apiData.forecast,
    };

    return normalizedData;
  }

  async getCurrentWeather(
    city: string,
    units: string = "metric"
  ): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseURL}/current?city=${encodeURIComponent(city)}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch current weather: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<any> = await response.json();

    if (!apiResponse.success) {
      throw new Error("API request was not successful");
    }

    return this.normalizeWeatherData(apiResponse.data, units);
  }

  async getForecast(
    city: string,
    days: number = 5,
    units: string = "metric"
  ): Promise<ForecastData> {
    const response = await fetch(
      `${this.baseURL}/forecast?city=${encodeURIComponent(
        city
      )}&days=${days}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast: ${response.statusText}`);
    }

    const apiResponse: ApiResponse<any> = await response.json();

    if (!apiResponse.success) {
      throw new Error("API request was not successful");
    }

    return this.normalizeForecastData(apiResponse.data);
  }

  async searchWeather(
    cities: string[],
    type: string = "current",
    units: string = "metric"
  ) {
    const citiesParam = cities.join(",");
    const response = await fetch(
      `${this.baseURL}/search?cities=${encodeURIComponent(
        citiesParam
      )}&type=${type}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(`Failed to search weather: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentWeatherByCoords(
    lat: number,
    lon: number,
    units: string = "metric"
  ): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseURL}/current?lat=${lat}&lon=${lon}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather by coordinates: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<any> = await response.json();

    if (!apiResponse.success) {
      throw new Error("API request was not successful");
    }

    return this.normalizeWeatherData(apiResponse.data, units);
  }
}

export const weatherApi = new WeatherApi();
