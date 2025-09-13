import { Request, Response } from "express";
import weatherService from "../services/weatherService";
import {
  WeatherQuery,
  ApiResponse,
  WeatherData,
  ForecastQuery,
  ForecastData,
} from "../types/weather.types";

class WeatherController {
  async getCurrentWeather(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const query: WeatherQuery = this.validateWeatherQuery(req.query);
      const weatherData = await weatherService.getCurrentWeather(query);

      const response: ApiResponse<WeatherData> = {
        success: true,
        data: weatherData,
        timestamp: new Date().toISOString(),
        meta: {
          requestId: this.generateRequestId(),
          responseTime: Date.now() - startTime,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, startTime);
    }
  }

  async getWeatherForecast(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const query: ForecastQuery = this.validateForecastQuery(req.query);
      const forecastData = await weatherService.getWeatherForecast(query);
      const response: ApiResponse<ForecastData> = {
        success: true,
        data: forecastData,
        timestamp: new Date().toISOString(),
        meta: {
          requestId: this.generateRequestId(),
          responseTime: Date.now() - startTime,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, startTime);
    }
  }

  private validateWeatherQuery(query: any): WeatherQuery {
    const { city, lat, lon, units, lang } = query;

    if (!city && (lat === undefined || lon === undefined)) {
      throw new Error("Either city or coordinates (lat, lon) must be provided");
    }

    if (lat !== undefined || lon !== undefined) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error(
          "Invalid coordinates: lat and lon must be valid numbers"
        );
      }

      if (latitude < -90 || latitude > 90) {
        throw new Error("Invalid latitude: must be between -90 and 90");
      }

      if (longitude < -180 || longitude > 180) {
        throw new Error("Invalid longitude: must be between -180 and 180");
      }

      return {
        lat: latitude,
        lon: longitude,
        units: this.validateUnits(units),
      };
    }

    // Validate city name
    if (typeof city !== "string" || city.trim().length === 0) {
      throw new Error("City name must be a non-empty string");
    }

    if (city.length > 100) {
      throw new Error("City name must be less than 100 characters");
    }

    return {
      city: city.trim(),
      units: this.validateUnits(units),
    };
  }

  private validateForecastQuery(query: any): ForecastQuery {
    const baseQuery = this.validateWeatherQuery(query);
    const { days } = query;
    let forecastDays = 5;

    if (days !== undefined) {
      const parsedDays = parseInt(days as string, 10);

      if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 5) {
        throw new Error("Days must be a number between 1 and 5");
      }

      forecastDays = parsedDays;
    }

    return {
      ...baseQuery,
      days: forecastDays,
    };
  }

  private validateUnits(units: any): "metric" | "imperial" | "kelvin" {
    if (!units) return "metric";

    const validUnits = ["metric", "imperial", "kelvin"];

    if (!validUnits.includes(units)) {
      throw new Error(`Invalid units: must be one of ${validUnits.join(", ")}`);
    }

    return units;
  }

  private handleError(error: any, res: Response, startTime: number): void {
    console.error("Weather Controller Error:", error);

    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let message = "An unexpected error occurred";

    if (error.message) {
      message = error.message;

      // Determine status code based on error message
      if (
        message.includes("not found") ||
        message.includes("Location not found")
      ) {
        statusCode = 404;
        errorCode = "LOCATION_NOT_FOUND";
      } else if (message.includes("Invalid") || message.includes("must be")) {
        statusCode = 400;
        errorCode = "INVALID_PARAMETERS";
      } else if (message.includes("API key")) {
        statusCode = 401;
        errorCode = "INVALID_API_KEY";
      } else if (message.includes("rate limit")) {
        statusCode = 429;
        errorCode = "RATE_LIMIT_EXCEEDED";
      } else if (
        message.includes("unavailable") ||
        message.includes("service")
      ) {
        statusCode = 503;
        errorCode = "SERVICE_UNAVAILABLE";
      }
    }

    const errorResponse = this.createErrorResponse(
      errorCode,
      message,
      startTime
    );
    res.status(statusCode).json(errorResponse);
  }

  private createErrorResponse(
    code: string,
    message: string,
    startTime: number
  ): ApiResponse<null> {
    return {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
      meta: {
        requestId: this.generateRequestId(),
        responseTime: Date.now() - startTime,
      },
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new WeatherController();
