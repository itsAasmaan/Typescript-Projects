import dotenv from "dotenv";
import path from "path";
import axios, { AxiosResponse } from "axios";
import {
  WeatherApiResponse,
  ForecastApiResponse,
  WeatherData,
  ForecastData,
  WeatherQuery,
  ForecastQuery,
} from "../types/weather.types";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || "";
    this.baseUrl =
      process.env.WEATHER_API_URL || "https://api.openweathermap.org/data/2.5";

    if (!this.apiKey) {
      throw new Error("WEATHER_API_KEY environment variable is required");
    }
  }

  async getCurrentWeather(query: WeatherQuery): Promise<WeatherData> {
    try {
      const params = this.buildWeatherParams(query);
      const response: AxiosResponse<WeatherApiResponse> = await axios.get(
        `${this.baseUrl}/weather`,
        { params, timeout: 10000 }
      );

      return this.transformWeatherData(response.data);
    } catch (error) {
      throw this.handleApiError(error, "Failed to fetch current weather");
    }
  }

  async getWeatherForecast(query: ForecastQuery): Promise<ForecastData> {
    try {
      const params = this.buildWeatherParams(query);
      const response: AxiosResponse<ForecastApiResponse> = await axios.get(
        `${this.baseUrl}/forecast`,
        { params, timeout: 10000 }
      );

      return this.transformForecastData(response.data, query.days || 5);
    } catch (error) {
      throw this.handleApiError(error, "Failed to fetch weather forecast");
    }
  }

  private buildWeatherParams(query: WeatherQuery) {
    const params: Record<string, any> = {
      appid: this.apiKey,
      units: query.units || "metric",
    };

    if (query.city) {
      params.q = query.city;
    } else if (query.lat !== undefined && query.lon !== undefined) {
      params.lat = query.lat;
      params.lon = query.lon;
    } else {
      throw new Error("Either city or coordinates (lat, lon) must be provided");
    }

    return params;
  }

  private transformWeatherData(data: WeatherApiResponse): WeatherData {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility,
        cloudiness: data.clouds.all,
        condition: data.weather[0]?.main || "Unknown",
        description: data.weather[0]?.description || "No description",
        icon: data.weather[0]?.icon || "01d",
      },
      sun: {
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private transformForecastData(
    data: ForecastApiResponse,
    days: number
  ): ForecastData {
    const dailyForecasts = new Map<string, any[]>();
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (date !== undefined) {
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, []);
        }

        dailyForecasts.get(date)!.push(item);
      }
    });

    const forecast = Array.from(dailyForecasts.entries())
      .slice(0, days)
      .map(([date, items]) => {
        const temps = items.map((item) => item.main.temp);
        const avgHumidity =
          items.reduce((sum, item) => sum + item.main.humidity, 0) /items.length;
        const avgWindSpeed =
          items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
        const avgCloudiness =
          items.reduce((sum, item) => sum + item.clouds.all, 0) / items.length;
        const avgRainChance =
          items.reduce((sum, item) => sum + item.pop * 100, 0) / items.length;
        const midDayItem = items[Math.floor(items.length / 2)] || items[0];

        return {
          date: new Date(date).toISOString(),
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps)),
            avg: Math.round(
              temps.reduce((sum, temp) => sum + temp, 0) / temps.length
            ),
          },
          condition: midDayItem.weather[0]?.main || "Unknown",
          description: midDayItem.weather[0]?.description || "No description",
          icon: midDayItem.weather[0]?.icon || "01d",
          humidity: Math.round(avgHumidity),
          windSpeed: Math.round(avgWindSpeed * 10) / 10,
          cloudiness: Math.round(avgCloudiness),
          chanceOfRain: Math.round(avgRainChance),
        };
      });

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        coordinates: {
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
        },
      },
      forecast,
    };
  }

  private handleApiError(error: any, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || defaultMessage;

        switch (status) {
          case 401:
            throw new Error("Invalid API key");
          case 404:
            throw new Error("Location not found");
          case 429:
            throw new Error("API rate limit exceeded");
          default:
            throw new Error(`Weather API error: ${message}`);
        }
      } else if (error.request) {
        throw new Error("Weather service is currently unavailable");
      }
    }

    throw new Error(defaultMessage);
  }
}

export default new WeatherService();
