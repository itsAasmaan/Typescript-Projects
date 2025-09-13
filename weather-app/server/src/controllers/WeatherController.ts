import { Request, Response } from "express";
import weatherService from "../services/weatherService";
import {
  WeatherQuery,
  ForecastQuery,
  ApiResponse,
  WeatherData,
  ForecastData,
} from "../types/weather.types";

class WeatherController {
  async getCurrentWeather(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    try {
      const query = this.extractWeatherQuery(req.query);
      const weatherData = await weatherService.getCurrentWeather(query);

      this.sendSuccessResponse(res, weatherData, startTime);
    } catch (error) {
      this.sendErrorResponse(res, error, startTime);
    }
  }

  async getWeatherForecast(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const query = this.extractForecastQuery(req.query);
      const forecastData = await weatherService.getWeatherForecast(query);

      this.sendSuccessResponse(res, forecastData, startTime);
    } catch (error) {
      this.sendErrorResponse(res, error, startTime);
    }
  }

  async searchWeather(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { cities, units, type } = req.query;
      const cityList = this.extractCityList(cities as string);
      const requestType = (type as string) || "current";
      const weatherUnits =
        (units as "metric" | "imperial" | "kelvin") || "metric";

      const results = await this.processBulkWeatherRequest(
        cityList,
        requestType,
        weatherUnits
      );
      this.sendSuccessResponse(res, results, startTime);
    } catch (error) {
      this.sendErrorResponse(res, error, startTime);
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================
  private extractWeatherQuery(query: any): WeatherQuery {
    const { city, lat, lon, units } = query;
    if (lat !== undefined && lon !== undefined) {
      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        units: this.validateUnits(units),
      };
    }

    if (city) {
      return {
        city: city.trim(),
        units: this.validateUnits(units),
      };
    }

    throw new Error("Either city or coordinates (lat, lon) must be provided");
  }

  private extractForecastQuery(query: any): ForecastQuery {
    const baseQuery = this.extractWeatherQuery(query);
    const { days } = query;

    let forecastDays = 5;
    if (days !== undefined) {
      const parsedDays = parseInt(days as string, 10);

      if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 5) {
        throw new Error("Days must be a number between 1 and 5");
      }

      forecastDays = parsedDays;
    }

    return { ...baseQuery, days: forecastDays };
  }

  private extractCityList(cities: string): string[] {
    if (!cities || typeof cities !== "string") {
      throw new Error(
        "Cities parameter is required and must be a comma-separated string"
      );
    }

    const cityList = cities
      .split(",")
      .map((city) => city.trim())
      .filter((city) => city.length > 0);

    if (cityList.length === 0) {
      throw new Error("At least one valid city name is required");
    }

    if (cityList.length > 10) {
      throw new Error("Maximum 10 cities allowed per request");
    }

    return cityList;
  }

  private async processBulkWeatherRequest(
    cityList: string[],
    type: string,
    units: "metric" | "imperial" | "kelvin"
  ): Promise<any> {
    const weatherPromises = cityList.map(async (city) => {
      try {
        const query = { city, units };

        if (type === "forecast") {
          return { city, data: await weatherService.getWeatherForecast(query) };
        } else {
          return { city, data: await weatherService.getCurrentWeather(query) };
        }
      } catch (error) {
        return {
          city,
          error: (error as Error).message || "Unknown error occurred",
        };
      }
    });

    const results = await Promise.all(weatherPromises);

    // Separate successful and failed requests
    const successful = results.filter((result) => result.data);
    const failed = results.filter((result) => result.error);

    return {
      successful,
      failed,
      summary: {
        total: cityList.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  private validateUnits(units: any): "metric" | "imperial" | "kelvin" {
    if (!units) return "metric";

    const validUnits: Array<"metric" | "imperial" | "kelvin"> = [
      "metric",
      "imperial",
      "kelvin",
    ];

    if (!validUnits.includes(units)) {
      throw new Error(`Invalid units: must be one of ${validUnits.join(", ")}`);
    }

    return units;
  }

  private sendSuccessResponse<T>(
    res: Response,
    data: T,
    startTime: number
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      meta: {
        requestId: this.generateRequestId(),
        responseTime: Date.now() - startTime,
      },
    };

    res.status(200).json(response);
  }

  private sendErrorResponse(
    res: Response,
    error: any,
    startTime: number
  ): void {
    console.error("Weather Controller Error:", error.message || error);

    const { statusCode, errorCode, message } = this.mapErrorToResponse(error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: errorCode,
        message,
      },
      timestamp: new Date().toISOString(),
      meta: {
        requestId: this.generateRequestId(),
        responseTime: Date.now() - startTime,
      },
    };

    res.status(statusCode).json(errorResponse);
  }

  private mapErrorToResponse(error: any): {
    statusCode: number;
    errorCode: string;
    message: string;
  } {
    const message = error.message || "An unexpected error occurred";

    // Network and service errors
    if (message.includes("ENOTFOUND") || message.includes("unavailable")) {
      return {
        statusCode: 503,
        errorCode: "SERVICE_UNAVAILABLE",
        message: "Weather service is temporarily unavailable",
      };
    }

    if (message.includes("API key") || message.includes("401")) {
      return {
        statusCode: 401,
        errorCode: "INVALID_API_KEY",
        message: "Invalid API key",
      };
    }

    if (message.includes("not found") || message.includes("404")) {
      return {
        statusCode: 404,
        errorCode: "LOCATION_NOT_FOUND",
        message: "Location not found",
      };
    }

    // Rate limit errors
    if (message.includes("rate limit") || message.includes("429")) {
      return {
        statusCode: 429,
        errorCode: "RATE_LIMIT_EXCEEDED",
        message: "API rate limit exceeded",
      };
    }

    // Validation errors (client errors)
    if (this.isValidationError(message)) {
      return {
        statusCode: 400,
        errorCode: "INVALID_PARAMETERS",
        message,
      };
    }

    // Default server error
    return {
      statusCode: 500,
      errorCode: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "development"
          ? message
          : "An unexpected error occurred",
    };
  }

  private isValidationError(message: string): boolean {
    const validationKeywords = [
      "must be",
      "required",
      "invalid",
      "between",
      "maximum",
      "minimum",
      "either",
      "should",
      "cannot",
      "exceeds",
      "less than",
      "greater than",
    ];

    return validationKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new WeatherController();
